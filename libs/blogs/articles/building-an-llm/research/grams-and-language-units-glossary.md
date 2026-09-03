# Grams and Language Units: A Cross-Domain Glossary

## Purpose and Scope

This is a working dictionary for terms that are easy to conflate because they
contain *gram*, *graph*, or the linguistic suffix *-eme*. It covers the current
core vocabulary and the most relevant historical vocabulary in:

- phonetics, phonology, morphology, lexicology, and semantics;
- graphemics, orthography, writing-system studies, and Unicode;
- corpus linguistics, natural-language processing, and string processing; and
- learning-and-memory neuroscience.

“Exhaustive” here means exhaustive within those declared domains as of
2026-09-03, including the terms needed to distinguish an abstract unit, its
observable realization, a sequence of units, and a stored memory trace. It does
not mean every English compound ending in `-gram` or every `-eme` ever coined.
Both patterns are productive, and many `-eme` words belong only to a particular
historical school. Those cases are labeled rather than silently treated as
universal.

## The Short Answer

The five starting terms do not belong to one hierarchy:

| Term | What it is | Primary academic domain |
| --- | --- | --- |
| **n-gram** | A contiguous sequence of *n* specified items, such as characters, phonemes, or tokens | Corpus linguistics, NLP, speech and string processing |
| **engram** | The enduring physical and/or chemical changes produced by learning that support a memory | Learning-and-memory neuroscience |
| **phoneme** | An abstract, minimally contrastive sound category in a particular language | Phonology |
| **morpheme** | A traditional minimal unit pairing linguistic form with lexical meaning or grammatical function | Morphology |
| **grapheme** | A minimally distinctive or functional unit in a particular writing system | Graphemics, grapholinguistics, orthography |

The suffix **`-gram`** normally means a drawing, piece of writing, or record,
from Greek *gramma*. The linguistic **`-eme`** pattern normally names an
abstract, system-level unit. A grapheme is therefore `graph- + -eme`, not a type
of n-gram. An n-gram is counted; an engram is a memory substrate; a phoneme,
morpheme, or grapheme is an analytical category. See
[Merriam-Webster’s `-gram` entry](https://www.merriam-webster.com/dictionary/gram)
and the [Unicode Glossary](https://www.unicode.org/glossary/).

## Fast Domain Map

| Question | Terms to use | Field or subfield |
| --- | --- | --- |
| What physical speech event or segment was produced? | phone, phonetic segment | Articulatory, acoustic, or auditory phonetics |
| Which sound distinctions can change linguistic identity? | phoneme, allophone, distinctive feature, minimal pair | Phonology, phonetics-phonology interface |
| How are meaningful word parts structured and realized? | morpheme, morph, allomorph, root, affix, stem | Morphology, morphophonology |
| What abstract vocabulary item groups inflected forms? | lexeme, lemma, word form | Lexicology, lexicography, corpus linguistics |
| What is a functional unit of a writing system? | grapheme, graph, allograph | Graphemics, grapholinguistics, orthography |
| How does software encode and display text? | abstract character, code point, code unit, grapheme cluster, glyph | Unicode, internationalization, text rendering |
| What linguistic value does a written sign carry? | phonogram, syllabogram, morphogram, logogram, ideogram | Writing-system typology, epigraphy, grammatology |
| What fixed-width local sequence is being counted or modeled? | n-gram, unigram, bigram, trigram, skip-gram | Corpus linguistics, NLP, information retrieval |
| What model-dependent segment does an LLM consume? | token, subword token, BPE token, WordPiece, Unigram-model piece | Computational linguistics, machine learning |
| What lasting biological change supports a memory? | engram, engram cell, engram ensemble, engram complex | Cellular, systems, and cognitive neuroscience |

## The Abstract Unit, Realization, and Variant Pattern

Traditional structural analysis often separates an abstract category from an
observable realization and from alternative realizations of that category:

| System | Abstract/system unit | Observable realization | Variants of one abstract unit | Typical notation |
| --- | --- | --- | --- | --- |
| Speech | **phoneme** | **phone** | **allophones** | `/p/` for a phoneme; `[p]`, `[pʰ]` for phones |
| Word structure | **morpheme** | **morph** | **allomorphs** | often braces for an abstract morpheme and hyphens at boundaries |
| Writing | **grapheme** | **graph**, or a visual **glyph** in some accounts | **allographs** | often `<a>` for a grapheme |

This parallel is useful, but it is not a natural law. Morphological theories
disagree about the status of morphemes and morphs, and graphemic traditions
disagree about *graph*, *glyph*, and *allograph*. In Unicode, a glyph is a font
or rendering-system form and is not formally the “allograph” layer of a
linguistic grapheme. Sources: the University of California, Santa Barbara
[linguistics glossary](https://hlw.id.ucsb.edu/glossary-of-terms/glossary-all-terms),
Haspelmath’s discussion of the multiple senses of
[*morph* and *morpheme*](https://pmc.ncbi.nlm.nih.gov/articles/PMC7327577/),
the [Unicode Glossary](https://www.unicode.org/glossary/), and Meletis on the
[contested cross-writing-system definition of *grapheme*](https://doi.org/10.1080/17586801.2019.1697412).

Two further patterns should not be forced into that table:

- A **lexeme** has **word forms**, and a dictionary or corpus chooses a
  **lemma** to represent it; linguistics does not normally call its forms
  “allolexemes.”
- An **engram** is a biological trace or distributed cell ensemble. It is not
  an abstract contrastive category with phones, morphs, or graphs as tokens.

## Speech and Phonological Units

| Term | Definition and relationship | Domain | Status/source |
| --- | --- | --- | --- |
| **phonetics** | Study of how speech is produced, transmitted acoustically, and perceived | Articulatory, acoustic, and auditory phonetics | Current; [UCSB glossary](https://hlw.id.ucsb.edu/glossary-of-terms/glossary-all-terms) |
| **phone** | A speech sound or phonetic segment considered without first assigning it contrastive status in a particular language | Phonetics | Current; see [Jurafsky and Martin, ch. 14](https://web.stanford.edu/~jurafsky/slp3/14.pdf) |
| **phoneme** | A language-specific category of sound whose substitution can distinguish linguistic forms; minimal pairs are standard evidence | Phonology | Current; [Unicode Glossary](https://www.unicode.org/glossary/) and [Cambridge phonemic analysis](https://www.cambridge.org/highereducation/books/phonology/569F5EEC569FBC1D01CAFFF4B413B274/phonemic-analysis/2D175AB7DA3B7875B5D996CFBDB7F7F0) |
| **allophone** | A phonetic realization of a phoneme. Its selection may be predictable from context or may occur in free variation without creating a lexical contrast | Phonology/phonetics interface | Current; [UCSB glossary](https://hlw.id.ucsb.edu/glossary-of-terms/glossary-all-terms) |
| **minimal pair** | Two forms differing in one phonological element and differing in meaning, used as evidence that the elements contrast | Phonological analysis | Current; [Cambridge phonemic analysis](https://www.cambridge.org/highereducation/books/phonology/569F5EEC569FBC1D01CAFFF4B413B274/phonemic-analysis/2D175AB7DA3B7875B5D996CFBDB7F7F0) |
| **distinctive feature** | A property such as voicing, place, or manner used to represent phonological contrasts and natural classes | Feature phonology | Current. It also shows why a phoneme is not a physically indivisible atom |
| **syllable** | A phonological organization unit typically built around a nucleus, with optional onset and coda | Phonology, phonetics | Current; [Jurafsky and Martin, ch. 14](https://web.stanford.edu/~jurafsky/slp3/14.pdf) |
| **mora** | A unit of syllable weight or timing in languages whose phonology distinguishes light and heavy syllables | Prosodic phonology | Current; [Unicode Glossary](https://www.unicode.org/glossary/) |
| **archiphoneme** | In some structuralist traditions, an abstract representative of phonemes whose contrast is neutralized in a particular environment | History and theory of phonology | Historical/theory-bound, not a universal analytical layer |
| **toneme** | A proposed contrastive tone unit, modeled on *phoneme* | Tonal and prosodic phonology | Attested but theory-dependent; contemporary work often analyzes tone with phonemes or features |
| **chroneme** | A proposed contrastive duration or length unit | Prosodic phonology | Historical/specialist; many accounts use phonological length features instead |
| **prosodeme** | A proposed functional unit of prosody, rhythm, stress, or intonation | Prosody | Historical/theory-dependent; the scope varies by author |

**Do not collapse these terms:** a phone can be measured without being a
phoneme; a phoneme is defined by a language’s system of contrasts; an allophone
is one way that phoneme is realized. A spectrogram records acoustic energy and
may provide evidence about a phone, but it is not a phoneme.

## Morphological, Lexical, and Semantic Units

| Term | Definition and relationship | Domain | Status/source |
| --- | --- | --- | --- |
| **morphology** | Study of word structure and relationships among word forms | Linguistic morphology | Current; [Cambridge Handbook of Morphology](https://assets.cambridge.org/97811070/38271/excerpt/9781107038271_excerpt.pdf) |
| **morph** | A minimal linguistic form: a concrete pairing of morphosyntactic/semantic content and phonological form | Morphology | Current but defined differently across theories; [Haspelmath 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7327577/) proposes this precise use |
| **morpheme** | Traditionally, the smallest component that contributes lexical meaning or grammatical function | Morphology | Core teaching term, theoretically contested; [Jurafsky and Martin, ch. 2](https://web.stanford.edu/~jurafsky/slp3/2.pdf) and [Haspelmath 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7327577/) |
| **allomorph** | One of the alternative forms that realizes a morpheme, often selected by phonological, morphological, or lexical context | Morphology, morphophonology | Current; [UCSB glossary](https://hlw.id.ucsb.edu/glossary-of-terms/glossary-all-terms) |
| **free morpheme** | A morpheme able to occur as an independent word in the relevant analysis | Morphology | Current introductory distinction |
| **bound morpheme** | A morpheme that must attach to other material | Morphology | Current; [UCSB glossary](https://hlw.id.ucsb.edu/glossary-of-terms/glossary-all-terms) |
| **root** | The lexical core remaining after relevant affixes are removed | Morphology | Current, but exact criteria vary across languages and theories |
| **base** | Any form to which a morphological operation applies | Morphology | Current; may itself contain affixes |
| **stem** | The form to which inflection applies in a given paradigm | Inflectional morphology | Current; may equal a root or a larger base |
| **affix** | Bound formative attached to a base, including prefixes, suffixes, infixes, and circumfixes | Morphology | Current; [UCSB glossary](https://hlw.id.ucsb.edu/glossary-of-terms/glossary-all-terms) |
| **clitic** | Form that is phonologically dependent but often has word- or phrase-level syntactic behavior | Morphology, syntax, prosody | Current; [UCSB glossary](https://hlw.id.ucsb.edu/glossary-of-terms/glossary-all-terms) |
| **zero morph** | An analysis in which a morphological contrast has no overt phonological or written material at a paradigm position | Morphological theory | Current in some frameworks; demonstrates that meaning and visible segments need not map one-to-one |
| **portmanteau morph** | One form simultaneously realizes multiple grammatical properties | Morphological theory | Current in some frameworks; another failure of one-form/one-meaning correspondence |
| **suppletion** | A paradigm uses etymologically or phonologically unrelated forms, as with *go/went* | Morphology | Current; shows why “one morpheme = one stable substring” is unreliable |
| **morphophoneme** | An abstract unit proposed to underlie a set of phonological alternants across related word forms | Morphophonology | Historical or framework-dependent; many modern analyses use rules, features, or underlying representations instead |
| **lexeme** | An abstract vocabulary item grouping related word forms under one lexical identity, such as `GO` for *go*, *goes*, *went*, and *gone* | Lexicology, lexical semantics, morphology | Current; see Cambridge on [lexical meaning and the lexicon](https://assets.cambridge.org/97805218/60314/excerpt/9780521860314_excerpt.htm) |
| **word form** | A particular inflected realization of a lexeme | Morphology, corpus linguistics | Current |
| **lemma** | The citation or headword form selected to represent a lexeme in a dictionary, corpus, or NLP pipeline | Lexicography, corpus linguistics, NLP | Current; a lemma is a conventionally selected representative, not the abstract lexeme itself |
| **sememe** | In structuralist accounts, the meaning associated with a morpheme, or a proposed minimal semantic unit | Lexical semantics; semantic knowledge bases | Historical/theory-bound in general linguistics, but operationalized in HowNet-style NLP; [ACL sememe-KB paper](https://aclanthology.org/2021.findings-acl.411/) |
| **grammeme** | A value or signification belonging to an inflectional category, such as singular or plural within number | Inflectional morphology, grammatical semantics | Theory/tradition-specific; [Mel’čuk and Wanner](https://olst.ling.umontreal.ca/static/pdf/Mel%27c%CC%8Cuk_Wanner_2008_Online.pdf) |
| **grammatical feature/value** | A broadly used modern representation such as `Number=Sing` or `Tense=Past` | Morphosyntax, corpus annotation, NLP | Current operational vocabulary; [Universal Dependencies](https://universaldependencies.org/u/feat/index.html). A UD value may correspond roughly to what another tradition calls a grammeme |

The introductory definition “morpheme = smallest meaningful unit” is useful but
not neutral. Zero expression, portmanteau expression, suppletion, and
word-and-paradigm theories all complicate a one-to-one decomposition of words
into meaningful substrings. Haspelmath notes that *morpheme* has been used in
several distinct senses; the
[Cambridge Handbook of Morphology](https://assets.cambridge.org/97811070/38271/excerpt/9781107038271_excerpt.pdf)
likewise treats the nature of the morpheme as a theoretical question.

## Writing-System and Graphemic Units

| Term | Definition and relationship | Domain | Status/source |
| --- | --- | --- | --- |
| **graphemics / graphematics / grapholinguistics** | Study of the organization and linguistic function of writing; authors differ on the preferred label and theoretical scope | Writing-system linguistics | Current but terminologically diverse; see Meletis on [graphemes](https://doi.org/10.1080/17586801.2019.1697412) and [allography](https://doi.org/10.1515/opli-2020-0006) |
| **orthography** | A language’s conventional spelling system and the study or description of those conventions | Applied and descriptive linguistics, literacy studies | Current |
| **graph** | In some grapholinguistic traditions, a concrete written occurrence or minimal graphic form realizing a grapheme | Graphetics, graphemics | Theory-dependent. It is unrelated to a mathematical graph or knowledge graph |
| **grapheme** | A minimally distinctive or functional unit of a particular writing system | Graphemics, orthography | Current but debated; [Unicode Glossary](https://www.unicode.org/glossary/) and [Meletis 2019](https://doi.org/10.1080/17586801.2019.1697412) |
| **allograph** | A noncontrastive form or positional/contextual variant of a grapheme | Graphemics, paleography, typography | Current but author-dependent; [Meletis 2020](https://doi.org/10.1515/opli-2020-0006). Literacy education sometimes also uses it for alternative spellings of one phoneme, a different convention |
| **glyph** | An abstract visual form selected to depict one or more characters; also used loosely for the visual mark itself | Typography, font technology, Unicode rendering | Current; [Unicode Glossary](https://www.unicode.org/glossary/). Character-to-glyph mapping can be one-to-one, one-to-many, or many-to-one |
| **glyph image** | A concrete rasterized or otherwise imaged instance of a glyph on a surface | Rendering, typography | Current; [Unicode Glossary](https://www.unicode.org/glossary/) |
| **letter** | A member of an alphabetic inventory; it may function as a grapheme but is not a universal synonym for grapheme | Orthography, writing systems | Current |
| **digraph** | Two letters or graphs functioning together as a writing-system unit, often for one phonological value, as English `<sh>` | Orthography, literacy studies | Current; not the same as a bigram, which is any counted two-item sequence |
| **trigraph** | Three letters or graphs functioning together as one orthographic unit | Orthography, literacy studies | Current; not the same as a trigram |
| **multigraph / n-graph** | General term for multiple graphs jointly functioning as one orthographic unit | Orthography | Specialist but useful; do not confuse with graph-theory multigraphs |
| **grapheme-to-phoneme correspondence (GPC/G2P)** | A mapping from written units to phonological units | Psycholinguistics, literacy, speech technology | Current. It may be complex, context-sensitive, and many-to-many |

A grapheme is not universally “a written phoneme.” That definition fits only a
subset of alphabetic cases. Across scripts, graphemes may carry phonemic,
syllabic, morphosyntactic, lexical, or mixed values. Meletis proposes a broad
cross-writing-system definition based on lexical distinctiveness, linguistic
value, and minimality, while noting that the very usefulness and definition of
*grapheme* remain debated.

### Written signs ending in `-gram`

| Term | What the sign primarily represents | Domain and caveat |
| --- | --- | --- |
| **phonogram** | A sound or sound sequence rather than a lexical meaning | Writing-system studies and epigraphy. Its size can be phonemic, consonantal, syllabic, or otherwise script-specific |
| **phonemogram** | A phonological sound value | Specialist synonym or refinement of *phonogram*, especially in Egyptology; Unicode notes that the two are often used interchangeably in practice |
| **syllabogram** | A syllable | Syllabaries, logosyllabaries, epigraphy |
| **morphogram** | A morpheme, emphasizing the form-to-morpheme relationship | Morphographic writing-system analysis; overlaps with *logogram* and is not used uniformly |
| **logogram / logograph** | A word or morpheme rather than only its pronunciation | Writing-system typology. Unicode treats *logogram* and *ideogram* as overlapping conventional labels in some logosyllabic contexts |
| **ideogram / ideograph** | An idea or concept; also a conventional label for a logosyllabic sign | Writing-system studies and Unicode. The “idea” analysis is often too loose for signs tied to particular words or morphemes |
| **pictogram / pictograph** | An object by conventional visual likeness | Semiotics, signage, writing-system history. A pictogram need not encode a linguistic expression |
| **sinogram** | A Chinese character | Sinology and writing-system studies; Unicode prefers *CJK ideograph* or *Han ideograph* |
| **semasiogram / sematogram** | Meaning without a necessary mapping to a specific spoken form | Semiotics and theories of semasiography. Whether such systems count as writing is theory-dependent |
| **radicogram** | In Unicode’s Egyptian-hieroglyph terminology, a sign pointing to both form and content without independently referring to an autonomous lexeme | Egyptology and Unicode; specialist, script-specific term |
| **classifier / determinative** | A semantic class used to interpret a written word, typically without its own pronunciation | Logosyllabic and hieroglyphic writing; not a `-gram` word but necessary to contrast with logograms and phonograms |

Sources: the [Unicode Glossary](https://www.unicode.org/glossary/),
[Unicode Standard chapter 6](https://www.unicode.org/versions/latest/ch06.pdf),
and [UAX #57, Unicode Egyptian Hieroglyph Database](https://www.unicode.org/reports/tr57/).
Unicode explicitly warns that *ideograph* and *logograph* are not always
systematically distinguished. A sign can also have different functions in
different contexts, so shape alone does not fix which `-gram` label applies.

## Unicode and Digital-Text Units

Do not use *character*, *grapheme*, *code point*, *byte*, and *glyph* as
synonyms. A practical layer model is:

```text
linguistic grapheme
  → abstract character sequence
  → code points
  → code units / bytes in an encoding
  → glyph selection and positioning
  → glyph image on a surface
```

None of those arrows is reliably one-to-one.

| Term | Definition | Domain/source |
| --- | --- | --- |
| **abstract character** | A unit of information used to organize, control, or represent textual data, independent of a particular visual appearance | Character encoding; [Unicode Glossary](https://www.unicode.org/glossary/) |
| **encoded character** | An abstract character associated with a Unicode code point | Unicode character encoding; [Unicode Standard chapter 3](https://www.unicode.org/versions/latest/core-spec/chapter-3/) |
| **code point** | An integer value in a coded character set’s codespace | Character encoding. A code point is not necessarily an assigned character |
| **Unicode scalar value** | Any Unicode code point except the surrogate code points `U+D800..U+DFFF` | Unicode; [Unicode Standard chapter 3](https://www.unicode.org/versions/latest/core-spec/chapter-3/) |
| **code unit** | The minimal fixed-width bit sequence used by an encoding form: 8 bits in UTF-8, 16 in UTF-16, and 32 in UTF-32 | Character encoding; [Unicode Character Encoding Model](https://www.unicode.org/reports/tr17/) |
| **byte** | An 8-bit storage unit in modern computing | Computer systems. A byte equals a UTF-8 code unit but not a UTF-16 or UTF-32 code unit |
| **combining character sequence** | A base character followed by one or more combining marks | Unicode composition and normalization |
| **grapheme cluster** | Text between algorithmically specified grapheme-cluster boundaries | Unicode text segmentation; [UAX #29](https://www.unicode.org/reports/tr29/) |
| **extended grapheme cluster (EGC)** | Unicode’s recommended, more inclusive grapheme-cluster variant for approximating user-perceived characters | Internationalization, cursor movement, deletion, regex, UI; [UAX #29](https://www.unicode.org/reports/tr29/) |
| **canonical equivalence** | Unicode relationship between character sequences that should represent the same abstract text, such as precomposed and decomposed accented forms | Unicode normalization; [Unicode Standard chapter 3](https://www.unicode.org/versions/latest/core-spec/chapter-3/) |
| **normalization form** | A standard transformation into a canonical or compatibility-normalized representation, such as NFC, NFD, NFKC, or NFKD | Unicode processing |
| **glyph / glyph ID / glyph image** | Visual form / font-local reference / rendered image | Typography and font rendering; [Unicode Glossary](https://www.unicode.org/glossary/) |

### Worked example: decomposed `é`

The decomposed string `e` + combining acute accent is:

- one extended grapheme cluster under UAX #29;
- two Unicode code points: `U+0065 U+0301`;
- three UTF-8 code units/bytes: `65 CC 81`;
- two UTF-16 code units: `0065 0301`; and
- commonly perceived and rendered as one visual character, although a renderer
  may compose one glyph or position multiple glyphs.

It may also be canonically equivalent to the single precomposed code point
`U+00E9`. This is why a “character n-gram” is underspecified unless the author
says whether the counted items are bytes, code units, code points, extended
grapheme clusters, or some language-specific orthographic unit. See the Unicode
[character and combining-mark FAQ](https://www.unicode.org/faq/char_combmark.html).

## N-Grams, Corpora, and NLP

### Core definition

An **n-gram** is a contiguous sequence of exactly *n* items drawn from a stated
sequence. If the token sequence is `the cat sat`, its word bigrams are
`the cat` and `cat sat`; its single trigram is `the cat sat`. The items do not
have to be meaningful or minimal. They can be bytes, code points, phonemes,
words, or labels. See Jurafsky and Martin’s
[chapter on n-gram language models](https://web.stanford.edu/~jurafsky/slp3/3.pdf).

| Term | Definition | Domain and caveat |
| --- | --- | --- |
| **n-gram order** | The value of *n*, or equivalently the number of items in each window | Statistical language modeling, corpus analysis |
| **unigram** | A one-item sequence (`n = 1`) | Corpus/NLP. Also overloaded by the Unigram subword tokenizer described below |
| **bigram / digram** | A two-item sequence (`n = 2`) | Corpus/NLP, cryptanalysis. *Digraph* instead means an orthographic unit of two graphs |
| **trigram** | A three-item sequence (`n = 3`) | Corpus/NLP. *Trigraph* instead means an orthographic unit of three graphs |
| **four-gram, five-gram, …** | Higher orders named transparently by number | Corpus/NLP. This naming avoids unrelated senses of words such as *tetragram* |
| **n-gram count / frequency** | Number of observed occurrences of an n-gram in a corpus | Corpus linguistics, information retrieval |
| **n-gram type** | A distinct n-gram pattern, separate from how many token occurrences it has | Corpus linguistics |
| **n-gram language model** | A probabilistic model that approximates the next item using the preceding `n − 1` items | Statistical NLP and speech recognition. The model is built from n-gram statistics; it is not itself one sequence |
| **bag of n-grams** | A multiset or count-vector representation that preserves local n-item windows but discards their global sequence order | Text classification, retrieval, feature engineering |
| **skip-n-gram / skip-gram sequence** | A gapped or noncontiguous generalization of an n-gram under a stated skip rule | Corpus NLP, speech, information retrieval; rules differ by author |
| **Skip-gram model (word2vec)** | A neural training objective that predicts surrounding context words from a center word | Distributional semantics; not merely a stored gapped substring. See [Mikolov et al. 2013](https://research.google/pubs/efficient-estimation-of-word-representations-in-vector-space/) |
| **k-gram / q-gram** | The same fixed-length substring construction with another variable letter | String matching, record linkage, databases, approximate search |
| **shingle** | A fixed-length token or character window, usually placed into a set or fingerprint for document resemblance | Information retrieval, near-duplicate detection; see the [foundational shingling paper](https://doi.org/10.1109/SEQUEN.1997.666900) |
| **k-mer** | A contiguous biological sequence of length *k*, normally nucleotides or amino acids | Bioinformatics and genomics. Mathematically analogous to an n-gram, but conventionally named by its biological domain |
| **collocation** | A combination whose co-occurrence is linguistically or statistically associated beyond arbitrary adjacency | Corpus linguistics, phraseology. An n-gram can be a collocation candidate; most observed n-grams are not collocations |

### Productive n-gram variants by atomic item

`n-gram` is a schema, so a full name should state its item type:

| Variant | Atomic item | Typical use |
| --- | --- | --- |
| **byte n-gram** | byte | Encoding-robust classification, malware/data analysis, multilingual text models |
| **code-unit n-gram** | UTF-8/16/32 code unit | Low-level implementation analysis; results depend on encoding form |
| **code-point n-gram** | Unicode code point | Unicode-aware string analysis that still may split user-perceived characters |
| **grapheme-cluster n-gram** | usually an extended grapheme cluster | User-perceived-character analysis and UI-safe string processing |
| **orthographic character n-gram** | author-defined written character | Authorship, language identification, search; definition must be stated |
| **phone n-gram** | phonetic segment | Speech recognition and phonetic sequence modeling |
| **phoneme n-gram** | phonological segment | Pronunciation, language identification, phonotactics |
| **syllable n-gram** | syllable | Speech/language modeling for syllable-centered systems |
| **morpheme n-gram** | linguistically analyzed morpheme | Morphologically informed corpus/NLP analysis |
| **subword-token n-gram** | tokenizer-defined piece | Neural-model corpus analysis; pieces need not be morphemes |
| **word/token n-gram** | word-like token | Language modeling, classification, corpus phrase analysis |
| **lemma n-gram** | normalized lemma | Corpus comparison while collapsing inflectional variation |
| **part-of-speech n-gram** | POS tag | Stylometry, syntactic-pattern classification |
| **annotation-label n-gram** | any sequential label, such as named-entity or prosodic tags | Sequence-model analysis |
| **syntactic/dependency n-gram** | author-defined path or fragment in a parse structure | Syntactic NLP; often noncontiguous or nonlinear, so its extraction rule must be stated |

### Tokenization terms that are not linguistic units by definition

| Term | Definition | Relationship to `-gram` terms |
| --- | --- | --- |
| **corpus** | The collection of texts or sequences used for analysis or training | Source from which n-grams and tokenizer vocabularies are estimated |
| **token occurrence** | One position or event in a tokenized sequence | Concrete instance, as opposed to a unique token type |
| **token type** | A distinct token value | Vocabulary member; not necessarily a lexeme, word, or morpheme |
| **tokenizer** | Procedure that maps input into a sequence of model/processable tokens and often maps token IDs back to text | Defines the atomic units from which token n-grams can be made |
| **subword token** | A model-dependent piece smaller than some words and larger than some characters | May resemble a morpheme by accident or frequency, but has no guaranteed linguistic meaning |
| **Byte Pair Encoding (BPE)** | In NLP, a vocabulary induction/segmentation family adapted from compression by repeatedly merging frequent adjacent symbol pairs | Pair-merging uses local bigram counts, but the resulting token vocabulary is not an inventory of linguistic morphemes; [Sennrich et al. 2016](https://aclanthology.org/P16-1162/) |
| **WordPiece** | A learned subword-vocabulary and segmentation family associated with likelihood-based or scoring-based piece selection | A tokenization method, not a word, grapheme, or morpheme inventory by definition |
| **Unigram tokenizer / Unigram language-model segmentation** | A probabilistic algorithm that chooses among candidate subword segmentations under a unigram model over pieces | “Unigram” names the model assumption over candidate pieces; it does not mean the final tokens are single letters or words; [Kudo 2018](https://aclanthology.org/P18-1007/) |
| **SentencePiece** | A tokenizer framework that can train directly from raw text and supports BPE and Unigram-model segmentation | Software/framework name, not a linguistic unit; [Kudo and Richardson 2018](https://aclanthology.org/D18-2012/) |

## Engrams and Memory Neuroscience

The modern engram literature uses *engram* for the enduring, learning-induced
physical and/or chemical changes that support a memory. It does not mean a
verbatim internal recording, a sentence fragment, or a single symbolic token.
The strongest modern overview is Josselyn and Tonegawa’s
[*Memory engrams: Recalling the past and imagining the future*](https://pmc.ncbi.nlm.nih.gov/articles/PMC7577560/).

| Term | Definition and relationship | Domain/status |
| --- | --- | --- |
| **memory trace** | General term for persisting changes left by learning that affect later retrieval or behavior | Cognitive psychology and neuroscience; often used as a near-synonym for engram |
| **engram** | Enduring offline physical and/or chemical changes induced by experience and capable of supporting later memory retrieval | Learning-and-memory neuroscience; current, but the precise substrate remains an active research question |
| **engram cell / engram neuron** | A cell activated and modified during learning whose later reactivation contributes causally to memory retrieval | Cellular and systems neuroscience. Activation during an event alone is not sufficient evidence |
| **engram-cell ensemble** | The group of engram cells associated with a memory within a brain region | Systems neuroscience |
| **engram complex / engram-cell ensemble complex** | Connected ensembles distributed across brain regions that jointly support aspects of a memory | Systems neuroscience; avoids treating one localized cell group as the complete memory |
| **engram-cell network** | The functional connectivity among engram cells and ensembles | Circuit neuroscience |
| **engram synapse / synaptic engram** | Learning-modified synaptic connectivity proposed to contribute to storage and reactivation | Synaptic and molecular neuroscience; see the [synaptic persistence review](https://pmc.ncbi.nlm.nih.gov/articles/PMC8024575/) |
| **engram allocation** | Competitive recruitment of particular neurons into an engram, influenced by properties such as excitability | Cellular memory research; [Han et al. 2007](https://pubmed.ncbi.nlm.nih.gov/17446403/) |
| **engram tagging / labeling** | Experimental marking of cells active during a defined learning window so they can later be observed or manipulated | Experimental neuroscience; the tag is a method, not the engram itself |
| **reactivation** | Later activation of learning-tagged engram cells during natural or artificial retrieval | Systems neuroscience. Overlap with encoding activity is evidence, not by itself a full causal demonstration |
| **encoding** | Processes by which experience initiates a memory representation | Cognitive and cellular neuroscience |
| **consolidation** | Processes that stabilize or reorganize memory after learning, at cellular and systems timescales | Learning-and-memory neuroscience |
| **storage** | Maintenance of information-supporting changes over time | Memory neuroscience |
| **retrieval / recall** | Processes by which a cue makes stored information available and produces memory expression | Cognitive and systems neuroscience |
| **reconsolidation** | Restabilization and possible updating after a retrieved memory becomes labile | Memory neuroscience; not every retrieval event necessarily produces the same reconsolidation process |
| **extinction** | New learning that reduces expression of a previously learned response | Learning theory and neuroscience; not generally equivalent to erasing its original engram |
| **active engram** | An engram currently reactivated during memory expression | Systems neuroscience |
| **latent / dormant engram** | Stored and available to natural cues in principle, but not active at the moment | Historical and contemporary engram vocabulary; authors do not always use *latent* and *dormant* identically |
| **silent engram** | A trace that natural cues fail to retrieve but that can produce memory expression after direct artificial activation in the relevant experiments | Experimental memory neuroscience; [retrieval review](https://pmc.ncbi.nlm.nih.gov/articles/PMC6903648/) |
| **unavailable engram/state** | Proposed state in which the information can no longer be recovered even by direct access attempts | Memory theory. Empirically establishing total unavailability is exceptionally difficult |
| **neuronal ensemble / cell assembly** | A coordinated group of neurons | General systems neuroscience. It becomes an engram claim only with evidence of enduring learning-related change and memory-specific causal involvement |

Modern causal work includes Liu and colleagues’ 2012 demonstration that
optogenetic reactivation of a sparse hippocampal population tagged during fear
learning was sufficient to evoke a memory-associated behavior in mice
([Nature](https://www.nature.com/articles/nature11028)). This is evidence about
a defined mouse fear-conditioning paradigm, not proof that every human memory
is a discrete object stored in a single location. Current reviews instead
describe distributed, connected ensembles and continuing uncertainty about the
physical basis of long-term memory.

### Historical Semon vocabulary

| Term | Historical meaning | Domain/status |
| --- | --- | --- |
| **mneme** | Semon’s broader name for the organism’s capacity to preserve and use the effects of experience | History of memory theory |
| **engraphy** | The process by which an experience inscribes or establishes an engram | Historical engram theory; roughly related to encoding, but not a modern one-to-one synonym |
| **ecphory** | Reactivation of a latent memory trace through interaction with a cue | History of psychology and retrieval theory; still appears in specialist memory discussions |

See the historical review of
[engraphy and ecphory](https://pmc.ncbi.nlm.nih.gov/articles/PMC10202315/).

## Extended and Historical `-eme` Dictionary

These words demonstrate why `-eme` is a naming pattern, not a single accepted
ontology. Some remain useful; others are tied to structuralism, tagmemics,
glossematics, sign-language history, semiotics, or speculative unitization.

| Term | Proposed unit | Field | Status/caveat |
| --- | --- | --- | --- |
| **phoneme** | Contrastive sound category | Phonology | Current core term |
| **morpheme** | Minimal meaningful/functional form unit | Morphology | Current core term, theoretically contested |
| **grapheme** | Minimal distinctive/functional writing unit | Graphemics | Current, definition contested across writing systems |
| **lexeme** | Abstract lexical item | Lexicology, lexical semantics | Current core term |
| **sememe** | Minimal semantic unit or the meaning of a morpheme | Structural semantics; HowNet NLP | Historical/theory-bound generally; operational in some knowledge bases |
| **grammeme** | Value of an inflectional category | Morphology, grammatical semantics | Current within particular traditions, not a universal label |
| **morphophoneme / morphoneme** | Abstract unit underlying morphophonological alternants | Morphophonology | Historical/framework-dependent |
| **archiphoneme** | Neutralized phonological contrast represented by a higher abstraction | Structural phonology | Historical/framework-dependent |
| **toneme** | Contrastive tone unit | Tonal phonology | Specialist/theory-dependent |
| **chroneme** | Contrastive duration unit | Prosodic phonology | Historical/specialist |
| **prosodeme** | Functional prosodic unit | Prosody | Variable and theory-dependent |
| **tagmeme** | In tagmemics, a grammatical unit correlating a structural function or slot with the class of possible fillers | American structural linguistics, tagmemics | Historically influential, not mainstream universal syntax; [Pike 1967](https://doi.org/10.1515/9783111657158) |
| **syntagmeme** | A construction made from a sequence or arrangement of tagmemes | Tagmemics | Historical/theory-bound |
| **taxeme** | In Bloomfield’s scheme, a minimal grammatical feature that combines with others into a meaningful tagmeme | History of American structural linguistics | Historical/theory-bound |
| **allotagma** | A concrete or variant realization analyzed under one tagmeme | Tagmemics | Historical; the proposed grammatical parallel to allophone/allomorph |
| **glosseme** | Used in different structuralist traditions for a minimal meaningful linguistic form or an irreducible unit of analysis | Bloomfieldian linguistics; Hjelmslevian glossematics | Ambiguous across schools; never use without naming the framework |
| **ceneme** | In glossematics, a unit on the expression side treated without content | Hjelmslevian linguistics and semiotics | Historical/specialist |
| **plereme** | In glossematics, a content-bearing unit | Hjelmslevian linguistics and semiotics | Historical/specialist |
| **episememe** | In Bloomfield’s terminology, the meaning associated with a tagmeme | History of structural semantics | Historical/specialist |
| **semanteme** | A proposed meaning-bearing linguistic element | Historical semantics and morphology | Definition varies substantially by author |
| **phraseme** | A conventionalized multiword lexical unit or set phrase | Phraseology, lexicography | Current in some traditions, not a universal primitive |
| **chereme** | Stokoe’s early term for a contrastive sign-language formational unit | Sign-language linguistics | Historically important; current work usually uses phonological units or parameters. See [Stokoe 1960](https://glottolog.org/resource/reference/id/718600) |
| **kineme** | A proposed contrastive unit of communicative body movement | Kinesics, gesture, nonverbal communication | Historical/theory-bound; not a linguistic phoneme for the body |
| **meme** | A proposed unit of cultural transmission or imitation | Cultural evolution, anthropology | Influential but contested; not a language-structure unit and unrelated to morpheme analysis |
| **mytheme** | A proposed minimal constituent of myth | Structural anthropology | Theory-bound |
| **narreme** | A proposed minimal narrative unit | Narratology, semiotics | Niche; no stable cross-theory definition |
| **behavioreme / uttereme** | Higher-level behavioral or utterance units in Pike’s unified tagmemic framework | History of tagmemics | Historical and framework-specific; [Pike 1967](https://doi.org/10.1515/9783111657158) |

For the general naming pattern, the
[*Concise Oxford Companion to the English Language* entry on `-eme`](https://www.encyclopedia.com/humanities/encyclopedias-almanacs-transcripts-and-maps/eme)
describes it as a suffix used for theoretical language units and gives
*phoneme*, *sememe*, *prosodeme*, and *tagmeme* as examples. The list above is
an index of important current and historically influential formations, not an
endorsement of one unified hierarchy.

## `-Gram` Terms That Are Signs, Records, or Wordplay—not Units in This Taxonomy

### Text, signs, and constrained writing

| Term | Meaning | Subject/domain | Why it is different |
| --- | --- | --- | --- |
| **anagram** | A word or phrase formed by rearranging the letters of another | Wordplay, recreational linguistics | A transformation/product, not a minimal unit |
| **pangram** | A text containing every letter of a chosen alphabet or inventory | Typography, testing, wordplay | A coverage-constrained text |
| **lipogram** | A text deliberately omitting a chosen letter or set of letters | Constrained writing | An omission-constrained composition |
| **tautogram** | A phrase or text whose words begin with the same letter | Constrained writing, rhetoric | A stylistic constraint |
| **isogram / heterogram** | In wordplay, a word or phrase avoiding repeated letters; both labels have other technical senses | Recreational linguistics | Niche and terminologically unstable |
| **ambigram** | Lettering designed to support more than one reading under transformation or viewpoint | Graphic design, typography | A visual design object |
| **autogram** | A self-enumerating or self-descriptive sentence | Recreational linguistics | A self-referential composition |
| **chronogram** | An inscription in which selected letters also encode a date as numerals | Epigraphy, wordplay | An encoded inscription |
| **cryptogram** | Enciphered or encoded text | Cryptography, puzzles | A message, not a linguistic primitive |
| **monogram** | A design made from one or more initials | Graphic design, identity | A mark or emblem |
| **epigram** | A short, pointed saying or poem | Literature, rhetoric | A genre/form, not an analytical unit |
| **telegram / cablegram / radiogram** | A message sent through a named transmission medium | Communications history | A message artifact using the record/writing sense of `-gram` |

These definitions follow the ordinary “drawing, writing, record” combining-form
sense cataloged by
[Merriam-Webster](https://www.merriam-webster.com/dictionary/gram). Because
writers can coin new constraint names, there is no closed universal list.

### Scientific and technical records

In many technical pairs, `-graph` names an instrument or method and `-gram`
names its output or record. These are legitimate `-gram` words, but they do not
name abstract language units:

| Family | Examples | Domain |
| --- | --- | --- |
| Acoustic records | **spectrogram**, **audiogram**, **phonocardiogram** | Acoustic phonetics, audiology, medicine |
| Electrical physiological records | **electroencephalogram (EEG)**, **electrocardiogram (ECG/EKG)**, **electromyogram (EMG)**, **electrooculogram (EOG)** | Neuroscience, cardiology, neurophysiology |
| Medical images | **mammogram**, **angiogram**, **myelogram**, **tomogram**, **sonogram**, **thermogram** | Radiology and medical imaging |
| Physical/chemical records | **seismogram**, **chromatogram**, **diffractogram** | Geophysics, analytical chemistry, crystallography |
| Mathematical/statistical graphics | **diagram**, **histogram**, **scattergram**, **dendrogram**, **cladogram** | Mathematics, statistics, clustering, phylogenetics |
| Optical/information records | **hologram** | Optics and imaging |

One item is directly relevant to language study: a **spectrogram** is a plot of
frequency content over time used to analyze speech acoustics. It is evidence
about the physical signal, not a phone, phoneme, grapheme, token, or engram.
See Jurafsky and Martin’s
[phonetics chapter](https://web.stanford.edu/~jurafsky/slp3/14.pdf).

### Unrelated lookalikes and eponyms

| Term | Actual domain/derivation | Distinction |
| --- | --- | --- |
| **gram (`g`)**, **kilogram**, **milligram**, **microgram** | Metrology and chemistry | Unit of mass; IUPAC defines `1 g = 10⁻³ kg` in its [Gold Book](https://goldbook.iupac.org/terms/view/G02680) |
| **Gram stain**, **Gram-positive**, **Gram-negative** | Microbiology; named for Hans Christian Gram | Eponym, not the Greek writing/record suffix |
| **gram** meaning chickpea or another pulse | Botany and food | Unrelated noun/etymon |
| **grammar / grammatical** | Linguistics; historically related to Greek writing/learning vocabulary | Contains the historical root but is not a counted `-gram` unit |
| **program / programme** | Instructions, plan, broadcast, or software | Historically contains the Greek writing root, but not a member of the n-gram or engram taxonomy |
| **Google Books Ngram Viewer** | Product and corpus interface | Uses textual n-grams; it is not a new unit called an “Ngram” |
| **extreme, supreme, scheme, theme, raceme, blaspheme** | Ordinary words with other histories and structures | Accidental final string `eme`, not analytical `-eme` formations |

## Common Category Errors

1. **“A grapheme is a written phoneme.”** Sometimes, in an alphabetic analysis;
   not as a universal definition. Graphemes can map to syllables, morphemes,
   words, or mixed values.
2. **“One Unicode code point is one character.”** Not reliably. User-perceived
   characters can contain multiple code points, and a code point can be
   unassigned or noncharacter/control data.
3. **“One glyph is one character.”** Not reliably. Rendering can select one
   glyph for several characters or several glyphs for one character.
4. **“A tokenizer discovers morphemes.”** Not by definition. BPE, WordPiece,
   and Unigram-model pieces optimize engineering/statistical objectives.
5. **“A unigram token is one character.”** No. It is one item under a declared
   vocabulary; a Unigram tokenizer can select multi-character pieces.
6. **“Skip-gram always means a gapped n-gram.”** No. In word2vec it names a
   predictive neural objective.
7. **“Every frequent n-gram is a collocation.”** No. Frequency alone does not
   establish a conventional or statistically exceptional association.
8. **“An engram is a stored sentence or exact replay.”** No. It is a proposed
   biological substrate of memory, often studied as distributed, plastic cell
   ensembles and synaptic changes.
9. **“A neuron active during learning is an engram cell.”** Activity is only a
   starting observation; modern engram claims seek learning-induced change,
   retrieval reactivation, and causal necessity and/or sufficiency.
10. **“All `-eme` words form one accepted ladder.”** No. Phoneme, morpheme,
    grapheme, and lexeme are widespread; many other formations are
    framework-specific or historical.

## Source Guide

### Standards and official technical references

- Unicode Consortium, [Glossary of Unicode Terms](https://www.unicode.org/glossary/).
- Unicode Consortium, [Unicode Standard, chapter 3: Conformance](https://www.unicode.org/versions/latest/core-spec/chapter-3/).
- Unicode Consortium, [Unicode Standard, chapter 6: Writing Systems and Punctuation](https://www.unicode.org/versions/latest/ch06.pdf).
- Unicode Consortium, [UAX #29: Unicode Text Segmentation](https://www.unicode.org/reports/tr29/).
- Unicode Consortium, [UTR #17: Unicode Character Encoding Model](https://www.unicode.org/reports/tr17/).
- Unicode Consortium, [UAX #57: Unicode Egyptian Hieroglyph Database](https://www.unicode.org/reports/tr57/).
- Universal Dependencies, [Universal Morphological Features](https://universaldependencies.org/u/feat/index.html).
- IUPAC, [Gold Book: gram](https://goldbook.iupac.org/terms/view/G02680).

### Linguistics and writing systems

- Carol Genetti, ed., [*How Languages Work* glossary](https://hlw.id.ucsb.edu/glossary-of-terms/glossary-all-terms), University of California, Santa Barbara / Cambridge University Press teaching resource.
- Martin Haspelmath, [“The morph as a minimal linguistic form”](https://pmc.ncbi.nlm.nih.gov/articles/PMC7327577/), *Morphology* 30 (2020).
- Dimitrios Meletis, [“The grapheme as a universal basic unit of writing”](https://doi.org/10.1080/17586801.2019.1697412), *Writing Systems Research* (2019).
- Dimitrios Meletis, [“Types of allography”](https://doi.org/10.1515/opli-2020-0006), *Open Linguistics* (2020).
- Richard Sproat, [“The Taxonomy of Writing Systems: How to Measure How Logographic a System Is”](https://direct.mit.edu/coli/article/47/3/477/102776/), *Computational Linguistics* 47.3 (2021).
- Igor Mel’čuk and Leo Wanner, [“Morphological Mismatches in Machine Translation”](https://olst.ling.umontreal.ca/static/pdf/Mel%27c%CC%8Cuk_Wanner_2008_Online.pdf), *Machine Translation* 22 (2008).
- Kenneth L. Pike, [*Language in Relation to a Unified Theory of the Structure of Human Behavior*](https://doi.org/10.1515/9783111657158), 2nd ed. (1967).
- William C. Stokoe, [*Sign Language Structure*](https://glottolog.org/resource/reference/id/718600) (1960).

### NLP and computational linguistics

- Daniel Jurafsky and James H. Martin, [*Speech and Language Processing*](https://web.stanford.edu/~jurafsky/slp3/), 3rd-edition online manuscript (2026), especially chapters 2, 3, and 14.
- Rico Sennrich, Barry Haddow, and Alexandra Birch, [“Neural Machine Translation of Rare Words with Subword Units”](https://aclanthology.org/P16-1162/) (ACL 2016).
- Tomas Mikolov et al., [“Efficient Estimation of Word Representations in Vector Space”](https://research.google/pubs/efficient-estimation-of-word-representations-in-vector-space/) (2013).
- Taku Kudo, [“Subword Regularization”](https://aclanthology.org/P18-1007/) (ACL 2018).
- Taku Kudo and John Richardson, [“SentencePiece”](https://aclanthology.org/D18-2012/) (EMNLP 2018).
- Fanchao Qi et al., [“Automatic Construction of Sememe Knowledge Bases via Dictionaries”](https://aclanthology.org/2021.findings-acl.411/) (ACL Findings 2021).

### Memory neuroscience

- Sheena A. Josselyn and Susumu Tonegawa, [“Memory engrams: Recalling the past and imagining the future”](https://pmc.ncbi.nlm.nih.gov/articles/PMC7577560/), *Science* 367 (2020).
- Xu Liu et al., [“Optogenetic stimulation of a hippocampal engram activates fear memory recall”](https://www.nature.com/articles/nature11028), *Nature* 484 (2012).
- Jin-Hee Han et al., [“Neuronal competition and selection during memory formation”](https://pubmed.ncbi.nlm.nih.gov/17446403/), *Science* 316 (2007).
- Tomás J. Ryan and Susumu Tonegawa, [“The neurobiological foundation of memory retrieval”](https://pmc.ncbi.nlm.nih.gov/articles/PMC6903648/), *Nature Reviews Neuroscience* 20 (2019).
- Rao-Ruiz et al., [“A Synaptic Framework for the Persistence of Memory Engrams”](https://pmc.ncbi.nlm.nih.gov/articles/PMC8024575/), *Frontiers in Synaptic Neuroscience* (2021).
- Laura A. A. de Oliveira et al., [historical review of Semon’s engram vocabulary](https://pmc.ncbi.nlm.nih.gov/articles/PMC10202315/) (2023).
