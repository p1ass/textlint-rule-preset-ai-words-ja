# textlint-rule-preset-ai-words-ja

AIが書いた日本語に出てきやすい単語と言い回しを見つける [textlint](https://textlint.github.io/) のプリセットです。

## 概要

<!-- textlint-disable ai-words-ja/no-ai-words -->

英語をそのまま直訳したような動詞や日常では使わない硬い名詞、一般的ではない比喩表現で使われる単語を、形態素解析で検出します。

形態素分析を用いているため、例えば「効く」を検出対象にすると、「効きます」「効かない」にもマッチするようにしています。

<!-- textlint-enable ai-words-ja/no-ai-words -->

[@textlint-ja/textlint-rule-preset-ai-writing](https://github.com/textlint-ja/textlint-rule-preset-ai-writing) は文章の構造 (リストの形、見出しの強調、コロンの使い方) を検出します。一方で、textlint-rule-preset-ai-words-jaは単語そのものを検出対象としています。


## インストール

```shell
npm install --save-dev textlint-rule-preset-ai-words-ja
```

## 使い方

`.textlintrc.json` にルールを追加してください。

```json
{
  "rules": {
    "preset-ai-words-ja": true
  }
}
```

## ルールの個別設定

以下のようにオプション値を設定することで、各ルールの挙動をカスタマイズできます。

```json5
{
  "rules": {
    "preset-ai-words-ja": {
      "no-ai-words": {
        "allows": ["経路", "/検査|部品/"],
        "severity": "warning" // デフォルトはerrorです
      },
      "no-short-topic-comma": {
        "maxLength": 3
      }
    }
  }
}
```


## ルール

### `no-ai-words`

辞書に載せた単語と言い回しを指摘します。

| オプション | 型 | デフォルト | 説明 |
| --- | --- | --- | --- |
| `allows` | `string[]` | `[]` | 指摘されたくない単語がある場合に指定してください。正規表現も設定可能です。 (`"/検査\|部品/"`) |
| `dictionaryPath` | `string` | なし | 追加で検出したい単語を書いた辞書ファイルのパスです。相対パスは設定ファイルのディレクトリから解決します。 |
| `dictionaryMode` | `"append" \| "override"` | `"append"` | `dictionaryPath` の辞書の読み込み方です。`"append"` は内蔵の辞書に追加し、`"override"` は内蔵の辞書を使わず `dictionaryPath` の辞書だけで検出します。 |

#### 辞書ファイルの書き方

辞書ファイルはJSONのオブジェクトで、`entries` の配列の各要素に指摘のメッセージと、一致させたい形態素の条件の並びを書きます。
条件には [kuromojin](https://github.com/azu/kuromojin) のトークンのプロパティ (`surface_form`、`pos`、`pos_detail_1`、`basic_form` など) を使えます。`basic_form` で書くと活用形もまとめて検出できます。

```json
{
  "entries": [
    {
      "message": "\"醸成\" は避けたい表現です。",
      "tokens": [{ "pos": "名詞", "basic_form": "醸成" }]
    },
    {
      "message": "\"見張る\" は避けたい表現です。",
      "tokens": [{ "pos": "動詞", "pos_detail_1": "自立", "basic_form": "見張る" }]
    }
  ]
}
```

```json
{
  "rules": {
    "preset-ai-words-ja": {
      "no-ai-words": {
        "dictionaryPath": "./ai-words.json"
      }
    }
  }
}
```



### `no-short-topic-comma`

主題を短く示しただけで打つ読点を指摘します。

指摘が多くなりやすいため、デフォルトでは無効です。使う場合は `{}` かオプションを指定して有効にしてください。

```json
{
  "rules": {
    "preset-ai-words-ja": {
      "no-short-topic-comma": {}
    }
  }
}
```

```
ポイントは、次の 3 つです。
結論は、シンプルです。
```

| オプション | 型 | 既定値 | 説明 |
| --- | --- | --- | --- |
| `maxLength` | `number` | `5` | 文頭から読点までが何文字以内なら指摘するか |

## 検出する単語

<!-- textlint-disable ai-words-ja/no-ai-words -->

| 語 |
| --- |
| 効く |
| 壊れる |
| 走る |
| 焼く (焼き込む) |
| 黙って |
| 〜に落ちる |
| 崩す |
| 値を動かす |
| 〜から引く |
| 経路 |
| 死活 |
| 漏れ |
| 帰結 |
| 原初 |
| 穴 |
| 無差別 |
| 正本 |
| 正典 |
| 部品 |
| 検査 |
| 〜に配線する |
| 太る |
| 見張る |
| 原料 |
| 実測 |
| 疑う |
| 照合 |
| 見落とす |
| 突き合わせる |
| 断定 |
| 入口 |
| 土台 |
| 道具 |
| 核心 |
| 構図 |
| 線引き |
| 事故 |
| 混ざる |
| 落とし穴 |
| 破綻 |
| 素通り |
| 切り分ける |
| 潰す |
| 踏み込む |
| 溶かす |
| 既定では |
| 定番 |
| 定石 |
| 〜した瞬間 |
| 静かに |
| 無言 |
| 門 |
| ゲート |

<!-- textlint-enable ai-words-ja/no-ai-words -->


## 開発

```shell
pnpm install
pnpm test         # tsc の型チェックと mocha
pnpm build        # 型定義と lib/ の出力
pnpm lint:text    # README を textlint にかける
```

## 参考

- [生成AI以前と以後でエンジニアの文章はどう変わったのか: Qiitaの7万記事を数えてみた話](https://nyosegawa.com/posts/qiita-writing-before-after-ai/)

Qiitaの7万記事を生成AIの前後で比べ、出現率が上がった語を数えた記事です。この記事で増加が報告された語を辞書に取り込んでいます。

## ライセンス

MIT
