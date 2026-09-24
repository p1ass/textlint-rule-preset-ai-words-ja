import type { TextlintRuleModule, TextlintRuleReporter } from "@textlint/types";
import type { TxtParentNode, TxtStrNode } from "@textlint/ast-node-types";
import { type KuromojiToken, tokenize } from "kuromojin";

type Node = TxtParentNode["children"][number];

export type Options = {
    maxLength?: number;
};

const DEFAULT_MAX_LENGTH = 5;

const isSentenceEnd = (token: KuromojiToken): boolean =>
    token.pos === "記号" && ["句点", "一般"].includes(token.pos_detail_1) && /^[。！？!?]$/.test(token.surface_form);

const isTouten = (token: KuromojiToken): boolean => token.pos === "記号" && token.pos_detail_1 === "読点";

const isTopicWa = (token: KuromojiToken): boolean =>
    token.pos === "助詞" && token.pos_detail_1 === "係助詞" && token.surface_form === "は";

const advance = (length: number, token: KuromojiToken): number => {
    if (isSentenceEnd(token)) {
        return 0;
    }
    const text = token.surface_form;
    // 段落の中の改行は Break にならず Str の文字として残るので、行頭から数え直す。
    const newline = text.lastIndexOf("\n");
    return newline === -1 ? length + text.length : text.length - newline - 1;
};

const reporter: TextlintRuleReporter<Options> = (context, options = {}) => {
    const { Syntax, RuleError, report, getSource, locator } = context;
    const maxLength = options.maxLength ?? DEFAULT_MAX_LENGTH;

    // 文を区切るノード。リンクや強調は入れず、中の Str を前後と同じ文として数える。
    const blocks = new Set<string>([
        Syntax.Paragraph,
        Syntax.Header,
        Syntax.BlockQuote,
        Syntax.List,
        Syntax.ListItem,
        Syntax.Table,
        Syntax.TableRow,
        Syntax.TableCell
    ]);

    return {
        async [Syntax.Document](document) {
            let length = 0;
            let afterTopic = false;

            const startSentence = () => {
                length = 0;
                afterTopic = false;
            };

            const scan = async (node: TxtStrNode) => {
                // padding は Str ノードからの相対値なので length とは別に数える。
                let offset = 0;
                for (const token of await tokenize(getSource(node))) {
                    if (afterTopic && isTouten(token) && length <= maxLength) {
                        report(
                            node,
                            new RuleError(
                                `主題を ${length} 文字示しただけで読点を打っています。読点を外すか、文を組み替えられないか検討してください。`,
                                { padding: locator.at(offset) }
                            )
                        );
                    }
                    offset += token.surface_form.length;
                    length = advance(length, token);
                    afterTopic = isTopicWa(token);
                }
            };

            const walk = async (node: Node): Promise<void> => {
                if (node.type === Syntax.Str) {
                    return scan(node);
                }
                if ("children" in node) {
                    for (const child of node.children) {
                        await walk(child);
                    }
                    if (blocks.has(node.type)) {
                        startSentence();
                    }
                    return;
                }
                // 「は」と読点の間に別のノードが挟まる場合は指摘しない。
                afterTopic = false;
                if (node.type === Syntax.Break) {
                    startSentence();
                } else if (node.type === Syntax.Code) {
                    length += node.value.length;
                }
            };

            for (const child of document.children) {
                await walk(child);
            }
        }
    };
};

const rule: TextlintRuleModule<Options> = reporter;

export default rule;
