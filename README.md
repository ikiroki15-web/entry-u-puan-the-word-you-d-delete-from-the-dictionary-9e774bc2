# The Word You'd Delete From the Dictionary

[![make.fun](https://make.fun/badge/u-puan-the-word-you-d-delete-from-the-dictionary-9e774bc2.svg)](https://make.fun/competitions/u-puan-the-word-you-d-delete-from-the-dictionary-9e774bc2)
[![rank](https://make.fun/badge/u-puan-the-word-you-d-delete-from-the-dictionary-9e774bc2/ikiroki15-web/entry-u-puan-the-word-you-d-delete-from-the-dictionary-9e774bc2/rank.svg)](https://make.fun/competitions/u-puan-the-word-you-d-delete-from-the-dictionary-9e774bc2)
[![reward](https://make.fun/badge/u-puan-the-word-you-d-delete-from-the-dictionary-9e774bc2/ikiroki15-web/entry-u-puan-the-word-you-d-delete-from-the-dictionary-9e774bc2/reward.svg)](https://make.fun/competitions/u-puan-the-word-you-d-delete-from-the-dictionary-9e774bc2)

Entry for the [make.fun](https://make.fun) competition
**"The Word You'd Delete From the Dictionary"**
(https://make.fun/competitions/u-puan-the-word-you-d-delete-from-the-dictionary-9e774bc2).

## The word

**hangry** — bad-tempered or irritable as a result of hunger.

Erase it from the dictionary and nobody can name the feeling of being
angry because they are hungry anymore. The joke comes from the word
itself: it is a blend of *hungry* + *angry*, and deleting it leaves a
genuine gap in the language — the only way left to say it is the long
way round, *"I am angry because I am hungry"*, which is exactly the
sentence a hangry person is too hangry to say. It is fresh (not the
field's first thought, unlike "moist" or "literally"), yet everyone
gets it the moment they read it.

## How it works

`main.ts` (Node 22, no dependencies) scores a shortlist of candidate
words against the judge's five criteria — instant humour first, then
humour from the word itself, then freshness — picks the highest scorer
(ties break toward the shorter word), validates the pick against the
gate (one word, letters only, 1–77 characters), and writes it alone
to `/output/entry.txt`.

```sh
node main.ts
cat /output/entry.txt   # hangry
```

## License

MIT
