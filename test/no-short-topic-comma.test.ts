import TextLintTester from "textlint-tester";
import rule from "../src/rules/no-short-topic-comma";

const tester = new TextLintTester();

const message = (length: number) =>
    `主題を ${length} 文字示しただけで読点を打っています。読点を外すか、文を組み替えられないか検討してください。`;

tester.run("no-short-topic-comma", rule, {
    valid: [
        "Client Secret を安全に保管できない Public Client の場合は、認可コードを使います。",
        "ブラウザ上の JavaScript がリソースサーバーにリクエストを行う場合は、CORS を設定します。",
        "そこで、次の手を考えます。",
        "こんにちは、p1ass です。",
        "議事録は溜めても資産になりません。",
        {
            text: "議事録は、溜めても資産になりません。",
            options: { maxLength: 3 },
            description: "maxLength を下げるとしきい値より長い主題は指摘しない"
        },
        {
            text: "[Tailscale](https://tailscale.com/)は、Wireguard プロトコルを使った VPN SaaS です。",
            description: "リンクのテキストも主題の文字数に数える"
        },
        {
            text: "`buildSrc` は、Gradle がコンパイルしビルドスクリプトのクラスパスに配置してくれます。",
            description: "インラインコードも主題の文字数に数える"
        },
        {
            text: "**Redis**は、使ったことがなくほとんど知識がありませんでした。",
            description: "強調の中のテキストも主題の文字数に数える"
        },
        {
            text: "入力は`inputs`、出力は`outputs`で宣言します。",
            description: "「は」と読点の間にインラインコードが挟まるものは主題として数えない"
        }
    ],
    invalid: [
        { text: "議事録は、溜めても資産になりません。", errors: [{ message: message(4) }] },
        { text: "目的は、記事を見分けることです。", errors: [{ message: message(3) }] },
        { text: "今回は、M1 Mac で試します。", errors: [{ message: message(3) }] },
        {
            text: "前提を確認します。結論は、まだ出ていません。",
            errors: [{ message: message(3) }],
            description: "2 文目でも文頭から数え直す"
        },
        {
            text: "前提を確認します。\n結論は、まだ出ていません。",
            errors: [{ message: message(3) }],
            description: "改行を主題の文字数に数えない"
        },
        {
            text: "前提を確認する\n結論は、まだ出ていません。",
            errors: [{ message: message(3) }],
            description: "句点のない行の後でも改行から数え直す"
        },
        {
            text: "Client Secret を安全に保管できない Public Client の場合は、認可コードを使います。",
            options: { maxLength: 50 },
            errors: [{ message: message(43) }],
            description: "maxLength を上げると長い主題も指摘する"
        },
        {
            text: "`aud` は、OpenID Connect の文脈での Audience です。",
            errors: [{ message: message(5) }],
            description: "インラインコードが短ければ主題も短いままとして指摘する"
        },
        {
            text: "# 結論は、まだ出ていない",
            errors: [{ message: message(3) }],
            description: "見出しの中でも指摘する"
        },
        {
            text: "**結論は、まだ出ていません。**",
            errors: [{ message: message(3) }],
            description: "強調の中でも指摘する"
        },
        {
            text: "[結論は、まだ出ていません](https://example.com)",
            errors: [{ message: message(3) }],
            description: "リンクテキストの中でも指摘する"
        },
        {
            text: "- 結論は、まだ出ていません。",
            errors: [{ message: message(3) }],
            description: "リストの中でも指摘する"
        },
        {
            text: "> 結論は、まだ出ていません。",
            errors: [{ message: message(3) }],
            description: "引用の中でも指摘する"
        },
        {
            text: "| 状況 |\n| --- |\n| 結論は、まだ |",
            errors: [{ message: message(3) }],
            description: "表のセルの中でも指摘する"
        },
        {
            text: "前提を確認します。  \n結論は、まだ出ていません。",
            errors: [{ message: message(3) }],
            description: "行末 2 スペースの改行でも文頭から数え直す"
        },
        {
            text: "前提を確認します。\n\n結論は、まだ出ていません。",
            errors: [{ message: message(3) }],
            description: "段落が変わっても文頭から数え直す"
        }
    ]
});
