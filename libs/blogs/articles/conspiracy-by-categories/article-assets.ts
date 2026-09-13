import { defineArticleAssets } from "@th-m/blogs/mdx";

export default defineArticleAssets({
  "covid-audio": {
    "kind": "audio",
    "source": "assets/mu-coronavirus.mp3",
    "label": "COVID audio — MU 23.04",
    "tags": ["research-audio", "covid"]
  },
  "titanic-audio": {
    "kind": "audio",
    "source": "assets/mu-titanic.mp3",
    "label": "Titanic audio — MU 29.24",
    "startAt": 6826,
    "tags": ["research-audio", "titanic"]
  },
  "panopticon-audio": {
    "kind": "audio",
    "source": "assets/mu-panopticon.mp3",
    "label": "Panopticon audio — MU 26.02",
    "tags": ["research-audio", "surveillance"]
  },
  "psyops-audio": {
    "kind": "audio",
    "source": "assets/mu-brain-warfare.mp3",
    "label": "Psyops audio — MU Plus 27.13, Brain Warfare",
    "startAt": 93,
    "tags": ["research-audio", "psyops"]
  },
  "syngenta-atrazine": {
    "kind": "image",
    "source": "assets/syngenta-atrazine-benefit.svg",
    "alt": "A proposed sequence from lobbying over EPA evidence standards to a costly research barrier and reduced liability, with only Syngenta's study qualifying for a historical quantitative review of frog effects",
    "tags": [
      "article-figure",
      "case-study",
      "financial-incentives"
    ]
  },
  "covid-vaccine-value": {
    "kind": "image",
    "source": "assets/covid-vaccine-value-map.svg",
    "alt": "Purchase revenue, PREP Act protection, and patent licensing connected to vaccine companies and technology owners",
    "tags": [
      "article-figure",
      "case-study",
      "financial-incentives"
    ]
  },
  "covid-research-connections": {
    "kind": "image",
    "source": "assets/covid-research-connections.svg",
    "alt": "Gates Foundation investment and research relationships, with separate EcoHealth grants and the NIH-funded Wuhan subaward",
    "tags": [
      "article-figure",
      "case-study",
      "research-funding"
    ]
  },
  "wtc-silverstein": {
    "kind": "image",
    "source": "assets/wtc-silverstein-incentives.svg",
    "alt": "WTC destruction followed by dismissal of one asbestos-dust cleanup claim and $4.57 billion in net-lessee insurance recovery",
    "tags": [
      "article-figure",
      "case-study",
      "financial-incentives"
    ]
  }
});
