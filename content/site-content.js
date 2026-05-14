/*
  Edit this file to update the website text, links, images, and publications.
  Keep image paths relative to the project root, for example: images/profile.jpeg
*/

window.siteContent = {
  site: {
    title: "Martyna Gruszka",
    description: "Personal website of Martyna Gruszka.",
    footerName: "Martyna Gruszka",
    analyticsId: "G-FYG36RC008"
  },

  nav: [
    { key: "about", label: "About" },
    { key: "music", label: "Music" },
    { key: "mext", label: "MEXT" },
    { key: "research", label: "Research" }
  ],

  pages: {
    about: {
      label: "About",
      eyebrow: "About",
      image: {
        src: "images/profile.jpeg",
        alt: "Main portrait of Martyna Gruszka"
      },
      paragraphs: [
        "Hi, and thank you for visiting my profile page. ",
        "I'm a 2nd-year Master's student in Computer Science at the Institute of Science Tokyo (formerly Tokyo Institute of Technology), currently conducting research in the Inoue Lab.",
        "I’m originally from Poland and have been living in Japan since 2020. What first brought me to Japan was my interest in the Japanese language, which I spent many years learning as a hobby.",
        "Music is my biggest passion - especially DTM and songwriting. I’m also part of the university’s rock club and occasionally perform at events."
      ],
      links: [
        {
          label: "Institution",
          url: "https://www.isct.ac.jp/en",
          icon: "fa-solid fa-building-columns"
        },
        {
          label: "GitHub",
          url: "https://github.com/martgru",
          icon: "fa-brands fa-github"
        },
        {
          label: "LinkedIn",
          url: "https://www.linkedin.com/in/martgru",
          icon: "fa-brands fa-linkedin-in"
        },
        {
          label: "Lab",
          url: "https://mmai.tech/",
          icon: "fa-solid fa-flask"
        },
        {
          label: "Company",
          url: "https://hugkun.com/",
          icon: "fa-solid fa-briefcase"
        },
        {
          label: "Club",
          url: "https://titech.info/circle/32",
          icon: "fa-solid fa-microphone"
        }
      ],
      artistLogo: {
        src: "images/maru-logo.png",
        alt: "MARU artist logo"
      }
    },

    music: {
      label: "Music",
      title: "My Music",
      albumPreview: {
        title: "Latest album preview",
        image: "images/cover.jpg",
        url: "https://linkco.re/FMG2EEpA"
      },
      artistPage: {
        label: "My TuneCore artist page",
        url: "https://www.tunecore.co.jp/artists/martgru"
      },
      performanceTitle: "Live Performances",
      performances: [
        {
          title: "Turnstile (クリコン 2025/12/06)",
          url: "https://www.youtube.com/watch?v=f5lAWJabpRU"
        },
        {
          title: "Linkin Park (新歓 2026/05/09)",
          url: "Coming soon"
        },
        {
          title: "Metallica (新歓 2026/05/09)",
          url: "Coming soon"
        }
      ]
    },

    mext: {
      label: "MEXT",
      eyebrow: "MEXT",
      title: "My Blog",
      leadParts: [
        "On my blog in Polish - '",
        {
          text: "Przez MEXT do Japonii",
          url: "https://martgru.substack.com/"
        },
        "', I share essential information and tips about the MEXT scholarship program, as well as my experiences of living and studying in Japan."
      ],
      posts: [
        {
          title: "MEXT - proces rekrutacyjny ⌛️",
          image: "images/1_etapy-rekrutacji.jpeg",
          url: "https://open.substack.com/pub/martgru/p/mext-proces-rekrutacyjny?r=5x2b0m&utm_campaign=post&utm_medium=web"
        },
        {
          title: "MEXT - przedmioty na roku przygotowawczym",
          image: "images/2_przedmioty-na-roku-przygotowawczym.jpeg",
          url: "https://open.substack.com/pub/martgru/p/mext-przedmioty-na-roku-przygotowawczym?r=5x2b0m&utm_campaign=post&utm_medium=web"
        },
        {
          title: "MEXT - egzaminy z matmy",
          image: "images/3_egzaminy-z-matmy.jpeg",
          url: "https://open.substack.com/pub/martgru/p/mext-egzaminy-z-matmy?r=5x2b0m&utm_campaign=post&utm_medium=web"
        },
        {
          title: "Z życia studenta - koszty i wydatki",
          image: "images/4_z-zycia-studenta.jpeg",
          url: "https://open.substack.com/pub/martgru/p/z-zycia-studenta-koszty-i-wydatki?r=5x2b0m&utm_campaign=post&utm_medium=web"
        },
        {
          title: "MEXT - język japoński 🇯🇵",
          image: "images/5_jezyk-japonski.jpeg",
          url: "https://open.substack.com/pub/martgru/p/mext-jezyk-japonski?r=5x2b0m&utm_campaign=post&utm_medium=web"
        },
        {
          title: "MEXT - rok przygotowawczy ⌛️",
          image: "images/6_rok-przygotowawczy.jpeg",
          url: "https://open.substack.com/pub/martgru/p/mext-rok-przygotowawczy?r=5x2b0m&utm_campaign=post&utm_medium=web"
        },
        {
          title: "Studia licencjackie w Japonii 🎓",
          image: "images/7_studia-licencjackie.jpeg",
          url: "https://open.substack.com/pub/martgru/p/studia-licencjackie-w-japonii?r=5x2b0m&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true"
        }
      ]
    },

    research: {
      label: "Research",
      eyebrow: "My Research",
      paragraphs: [
        "My academic interests lie at the intersection of natural language processing (NLP) and computer vision, with a strong passion for Large Language Models, Vision-Language Models, and their potential to support language learning.",
        "I am also a huge fan of the Natural Approach and Comprehensible Input theory, and I believe that the age of AI offers an exciting opportunity to rethink and improve how we teach and learn languages."
      ],
      publicationsTitle: "List of my publications",
      publications: [
        {
          title: "MES-Bench: A Benchmark for Multimodal Elaborative Simplification and Comprehensibility Evaluation in Language Learning"
        },
        {
          title: "DISCODE: Distribution-Aware Score Decoder for Robust Automatic Evaluation of Image Captioning",
          url: "https://arxiv.org/abs/2512.14420"
        },
        {
          title: "Elaborative Text Simplification via Target Estimation using Large Language Models",
          url: "files/ElabSimp-2025-paper.pdf"
        }
        
      ],
      image: {
        src: "images/mes.png",
        alt: "MES-Bench overview"
      }
    }
  }
};
