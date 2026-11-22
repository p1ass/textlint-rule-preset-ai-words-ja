import TextLintTester from "textlint-tester";
import { dictionary } from "../src/dictionary";
import rule from "../src/rules/no-ai-words";

const tester = new TextLintTester();

const userDictionaryPath = `${__dirname}/fixtures/dictionary.json`;

// 辞書のメッセージを引き当てて期待値にする。同じ語に対して 2 つ以上の書き方が残っていたら落とす。
const messageOf = (keyword: string): string => {
    const messages = [...new Set(dictionary.filter((entry) => entry.message.includes(keyword)).map((entry) => entry.message))];
    if (messages.length !== 1) {
        throw new Error(`${keyword} に対応するメッセージが ${messages.length} 件見つかりました`);
    }
    return messages[0];
};

const invalid = (text: string, keyword: string) => ({
    text,
    errors: [{ message: messageOf(keyword) }]
});

const recorded = (text: string, keyword: string, meaning: string) => ({
    ...invalid(text, keyword),
    description: `${meaning}の意味とは形態素で切り分けられないので、指摘してしまうことを記録しておく`
});

tester.run("no-ai-words", rule, {
    valid: [
        "有効活用していきたいです。",
        "効率よく進めます。",
        "リクエストが落ち着く前に切ります。",
        "水が漏れるので直します。",
        "次の実験の配線を準備します。",
        "光配線方式の物件に住んでいます。",
        "結果として妥当な線に落ち着きました。",
        "自走できるエンジニアを目指します。",
        "サーバーが落ちました。",
        "コードを載せておきます。",
        "テストケースを通しました。",
        "見出しの下に罫線を引きます。",
        "読者の注意を引く要素は絞ります。",
        "発表資料から引用しました。",
        "ローカルで DB サーバを動かします。",
        "まず手を動かしてみます。",
        "部屋にゴミが落ちている。",
        "動画の素材を差し替えます。",
        "暗黙的にアクセスできます。",
        "出力の品質が落ちました。",
        "検査官が来ました。",
        "検索の結果を貼ります。",
        "差分が出ないことを確かめます。",
        "既定値を変更します。",
        "その瞬間に気づきました。",
        "静かに話します。",
        "専門家に聞きます。",
        "部門をまたいで調整します。",        "要素の数を数えます。",
        "日本語版を公開します。",
        "最新版に更新します。",
        "本を出版します。",
        {
            text: "MDX の経路が 2 つあります。",
            options: { allows: ["経路"] },
            description: "allows に挙げた語は指摘しない"
        },
        {
            text: "生の値の検査を CI で回します。",
            options: { allows: ["/検査|部品/"] },
            description: "allows は正規表現でも書ける"
        },
        {
            text: "MDX の経路が 2 つあります。",
            options: { dictionaryPath: userDictionaryPath, dictionaryMode: "override" },
            description: "dictionaryMode を override にすると内蔵の辞書の語は指摘しない"
        }
    ],
    invalid: [
        {
            text: "チームの文化を醸成し、利用者に寄り添いました。",
            options: { dictionaryPath: userDictionaryPath },
            errors: [{ message: '"醸成" は避けたい表現です。' }, { message: '"寄り添う" は避けたい表現です。' }],
            description: "dictionaryPath の辞書の語を、活用形も含めて指摘する"
        },
        {
            text: "この設定が効きます。文化を醸成します。",
            options: { dictionaryPath: userDictionaryPath },
            errors: [{ message: messageOf('"効く"') }, { message: '"醸成" は避けたい表現です。' }],
            description: "dictionaryPath を指定しても内蔵の辞書の語は指摘する"
        },
        invalid("この設定が効きます。", '"効く"'),
        invalid("インデックスが効かない。", '"効く"'),
        invalid("同名の記事を書いた時点で壊れます。", '"壊れる"'),
        invalid("バッチ処理が走ります。", '"走る"'),
        invalid("色がビルド時に焼き込まれます。", '"焼く"'),
        invalid("エラーが黙って握りつぶされます。", '"黙って"'),
        invalid("警告を出さず黙って進みます。", '"黙って"'),
        invalid("sans-serif が中国語のフォントに落ちます。", '"〜に落ちる"'),
        invalid("指定が無いと既定値に落ちる。", '"〜に落ちる"'),
        invalid("問いの前提を崩します。", '"崩す"'),
        invalid("このトークンの値を動かさないでください。", '"値を動かす"'),
        invalid("値は styles のトークンから引きます。", '"〜から引く"'),
        invalid("キャッシュから引いた値を使います。", '"〜から引く"'),
        invalid("MDX の経路が 2 つあります。", '"経路"'),
        invalid("リンク先の死活に依存しています。", '"死活"'),
        invalid("検証の漏れがあります。", '"漏れ"'),
        invalid("実装の不備ではなく設計上の帰結です。", '"帰結"'),
        invalid("原初の売り文句は無価値です。", '"原初"'),
        invalid("動的な組み立てが最大の穴です。", '"穴"'),
        invalid("無差別に削除します。", '"無差別"'),
        invalid("この事実を正本とします。", '"正本"'),
        invalid("似た役割の部品を探します。", '"部品"'),
        invalid("UI 部品は 3 対 1 を満たします。", '"部品"'),
        invalid("生の値の検査を CI で回します。", '"検査"'),
        invalid("ビルドの最後に検査します。", '"検査"'),
        invalid("この事実を正典とします。", '"正典"'),
        invalid("各実装に配線します。", '"配線する"'),
        invalid("画像を 2 組持つとリポジトリが太ります。", '"太る"'),
        invalid("モバイルでの横あふれを見張ります。", '"見張る"'),
        invalid("色の原料をここに置きます。", '"原料"'),
        invalid("実測では 120 ms でした。", '"実測"'),
        invalid("この前提を疑います。", '"疑う"'),
        invalid("ログと実装を照合します。", '"照合"'),
        invalid("仕様を見落としていました。", '"見落とす"'),
        invalid("ログと実装を突き合わせます。", '"突き合わせる"'),
        invalid("原因の断定は避けます。", '"断定"'),
        invalid("学習の入口として最適です。", '"入口"'),
        invalid("設計の土台になります。", '"土台"'),
        invalid("測定のための道具を選びます。", '"道具"'),
        invalid("問題の核心はここです。", '"核心"'),
        invalid("全体の構図を整理します。", '"構図"'),
        invalid("責務の線引きが曖昧です。", '"線引き"'),
        invalid("設定ミスという事故が起きました。", '"事故"'),
        invalid("責務が混ざります。", '"混ざる"'),
        invalid("ここに落とし穴があります。", '"落とし穴"'),
        invalid("前提が破綻します。", '"破綻"'),
        invalid("警告が素通りされます。", '"素通り"'),
        invalid("原因を切り分けます。", '"切り分ける"'),
        invalid("バグを潰します。", '"潰す"'),
        invalid("実装の詳細に踏み込みます。", '"踏み込む"'),
        invalid("層の境界を溶かします。", '"溶かす"'),
        invalid("既定ではこの値が使われます。", '"既定では"'),
        invalid("定番の構成です。", '"定番"'),
        invalid("定石どおりに実装します。", '"定石"'),
        invalid("設定を変えた瞬間に気づきました。", '"〜した瞬間"'),
        invalid("警告が静かに無視されます。", '"静かに"'),
        {
            text: "この機能は静かに壊れます。",
            errors: [{ message: messageOf('"静かに"') }, { message: messageOf('"壊れる"') }],
            description: "「静かに」と「壊れる」は別の表現なので、同じ箇所で 2 件指摘する"
        },
        invalid("エラーが無言で握りつぶされます。", '"無言"'),
        invalid("マージ前の門になります。", '"門"'),
        invalid("CI に品質ゲートを置きます。", '"ゲート"'),
        invalid("ゲート付きの手順にします。", '"ゲート"'),
        invalid("ロックファイルを作った版に合わせます。", '"版"'),
        invalid("ブラウザの版が上がります。", '"版"'),
        recorded("選考に落ちてしまいました。", '"〜に落ちる"', "落下や不合格"),
        recorded("通勤中に事故に遭いました。", '"事故"', "交通事故"),
        recorded("建物の土台を補強します。", '"土台"', "建築"),
        recorded("工具箱から道具を出します。", '"道具"', "実際の工具"),
        recorded("ケーキを切り分けます。", '"切り分ける"', "刃物で分ける"),
        recorded("空き缶を潰します。", '"潰す"', "物をへこませる"),
        recorded("氷を溶かします。", '"溶かす"', "固体を液体にする"),
        recorded("絵の具の色が混ざります。", '"混ざる"', "物が入りまじる"),
        recorded("アクセルを踏み込みます。", '"踏み込む"', "足で踏む"),
        recorded("彼は無言でうなずきました。", '"無言"', "人が話さない"),
        recorded("正面の門をくぐります。", '"門"', "建物の門"),
        recorded("空港のゲートに向かいます。", '"ゲート"', "空港や施設の出入口"),
        recorded("API ゲートウェイを置きます。", '"ゲート"', "ゲートウェイ"),
        recorded("その本は版を重ねました。", '"版"', "書籍の刷りや改訂")
    ]
});
