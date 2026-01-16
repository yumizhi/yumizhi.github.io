---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>

# 🐝 About me

I am a Ph.D. Candidate at Nanjing University, advised by Associate Professor [Lin Shang](https://cs.nju.edu.cn/shanglin/index.htm). I received my B.S. degree from the Department of Computer Science and Technology from Nanjing University. During my undergraduate studies, I was awarded the People's Scholarship. I was also awarded the President's Scholarship in the first year of my Ph.D. studies.

My research focuses on watermark generation, emphasizing diffusion model and adversarial attacks, as well as privacy protection in AI applications. I am eager to engage in academic collaborations and welcome inquiries about my work. Please feel free to contact me if you're interested in discussing potential research opportunities or have any questions about my areas of expertise.


# 🔥 News
- **2024**: &nbsp;🎉🎉 <a href="https://ieeexplore.ieee.org/abstract/document/10650867" target="_blank">Sparse Attack with Meta-Learning</a> is accepted to IJCNN 2024. 
- **2024**: &nbsp;🎉🎉 <a href="https://link.springer.com/chapter/10.1007/978-981-97-2242-6_10" target="_blank">SASBO: Sparse Attack via Stochastic Binary Optimization</a> is accepted to PAKDD 2024. 

# 📝 Publications 

<div class='paper-box'>
  <div class='paper-box-image'><div><div class="badge">PAKDD 2024</div><img src='images/pakdd2024.png' alt="sym" width="100%"></div></div>
  <div class='paper-box-text' markdown="1">

<span style="color:red">(Oral)</span> [SASBO: Sparse Attack via Stochastic Binary Optimization](https://link.springer.com/chapter/10.1007/978-981-97-2242-6_10)

<strong>Yihan Meng</strong>, Weitao Li, Lin Shang 
</div>
</div>

<ul>
  <li>
    <code class="language-plaintext highlighter-rouge">IJCNN 2024</code> <span style="color:red">(Oral)</span> <a href="https://ieeexplore.ieee.org/abstract/document/10650867">Sparse Attack with Meta-Learning</a>, Weitao Li, Mingqian Lin, <strong>Yihan Meng</strong>, Yangdai Si, Lin Shang.
  </li>
</ul>

<!-- - [Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ornare aliquet ipsum, ac tempus justo dapibus sit amet](https://github.com), A, B, C, **CVPR 2020** -->

# 🎖 Honors and Awards

<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
  <strong>Outstanding Graduate Student</strong>
  <span>2025</span>
</div>

<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
  <strong>President's Scholarship</strong>
  <span>2023</span>
</div>

<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
  <strong>People's Scholarship</strong>
  <span>2022</span>
</div>

# 📖 Education

<div style="display: flex; align-items: center; margin-bottom: 20px;">
  <img src="./images/nju_sign.svg" style="width: 60px; height: 60px; margin-right: 15px; object-fit: contain;">
  <div style="flex-grow: 1;">
    <div style="display: flex; justify-content: space-between;">
      <strong style="font-size: 1.1em;">Nanjing University</strong>
      <span style="color: #666; font-size: 0.9em;">Nanjing, China</span>
    </div>
    <div style="display: flex; justify-content: space-between; margin-top: 3px;">
      <span>Ph.D. Candidate in Computer Science and Technology</span>
      <span style="font-style: italic; color: #444;">Sept. 2023 - Present</span>
    </div>
  </div>
</div>

<div style="display: flex; align-items: center;">
  <img src="./images/nju_sign.svg" style="width: 60px; height: 60px; margin-right: 15px; object-fit: contain;">
  <div style="flex-grow: 1;">
    <div style="display: flex; justify-content: space-between;">
      <strong style="font-size: 1.1em;">Nanjing University</strong>
      <span style="color: #666; font-size: 0.9em;">Nanjing, China</span>
    </div>
    <div style="display: flex; justify-content: space-between; margin-top: 3px;">
      <span>B.S. in Computer Science and Technology</span>
      <span style="font-style: italic; color: #444;">Sept. 2019 - June 2023</span>
    </div>
  </div>
</div>

<!-- # 💬 Presentations
- 🤓Later. -->

# 💻 Internships
- **2025.07 - Present**, [Guodian Nanjing Automation Co.,Ltd](http://www.sac-china.com/), China.

<a id="open-source"></a>
# 🛠️ Projects

### [Lightweight EPUB Merge Tool](https://github.com/yumizhi/lightweight_epub_merge_tool)

[![Release](https://img.shields.io/github/v/release/yumizhi/lightweight_epub_merge_tool?style=flat-square)](https://github.com/yumizhi/lightweight_epub_merge_tool)
[![Downloads](https://img.shields.io/github/downloads/yumizhi/lightweight_epub_merge_tool/total?style=flat-square)](https://github.com/yumizhi/lightweight_epub_merge_tool/releases)
[![License](https://img.shields.io/github/license/yumizhi/lightweight_epub_merge_tool?style=flat-square)](https://github.com/yumizhi/lightweight_epub_merge_tool/blob/main/LICENSE)
[![Stars](https://img.shields.io/github/stars/yumizhi/lightweight_epub_merge_tool?style=flat-square)](https://github.com/yumizhi/lightweight_epub_merge_tool/stargazers)
[![Forks](https://img.shields.io/github/forks/yumizhi/lightweight_epub_merge_tool?style=flat-square)](https://github.com/yumizhi/lightweight_epub_merge_tool/network/members)

A lightweight merge tool for multi-volume light-novel EPUBs: it tries to preserve illustrations and chapter structure as much as possible, and rebuilds a volume-grouped table of contents (TOC).

* Merge multiple EPUB volumes into a single omnibus edition, rebuilding an overall TOC grouped by volume (supports EPUB2/EPUB3).
* Preserve text, illustrations, CSS, and other resources as much as possible.
* Provides both a CLI and a PySide6/Qt GUI.
* Releases provide packaged builds that can be run directly.


**Links:** [Repo](https://github.com/yumizhi/lightweight_epub_merge_tool) ·
[Releases](https://github.com/yumizhi/lightweight_epub_merge_tool/releases) ·
[Docs](https://github.com/yumizhi/lightweight_epub_merge_tool#readme)


