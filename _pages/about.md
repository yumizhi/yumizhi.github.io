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

I am a Ph.D. Candidate at Nanjing University, working under Associate Professor [Lin Shang](https://cs.nju.edu.cn/shanglin/index.htm). I earned my bachelor's degree in the Department of Computer Science and Technology from Nanjing University. During my undergraduate studies, I was awarded the People's Scholarship. I was also awarded the President's Scholarship in the first year of my Ph.D. studies.

My research focuses on machine learning, emphasizing adversarial attacks and defenses, as well as privacy protection in AI applications. I am eager to engage in academic collaborations and welcome inquiries about my work. Please don't hesitate to contact me if you're interested in discussing potential research opportunities or have any questions about my areas of expertise.


# 🔥 News
- *2024.03*: &nbsp;🎉🎉 <a href="https://ieeexplore.ieee.org/abstract/document/10650867" target="_blank">Sparse Attack with Meta-Learning</a> is accepted by IJCNN 2024. 
- *2024.01*: &nbsp;🎉🎉 <a href="https://link.springer.com/chapter/10.1007/978-981-97-2242-6_10" target="_blank">SASBO: Sparse Attack via Stochastic Binary Optimization</a> is accepted by PAKDD 2024. 

# 📝 Publications 

<div class='paper-box'>
  <div class='paper-box-image'><div><div class="badge">PAKDD 2024</div><img src='images/pakdd2024.png' alt="sym" width="100%"></div></div>
  <div class='paper-box-text' markdown="1">

<span style="color:red">(Oral)</span> [SASBO: Sparse Attack via Stochastic Binary Optimization](https://link.springer.com/chapter/10.1007/978-981-97-2242-6_10)

**Yihan Meng**, Weitao Li, Lin Shang 
</div>
</div>

<ul>
  <li>
    <code class="language-plaintext highlighter-rouge">IJCNN 2024</code> <span style="color:red">(Oral)</span> <a href="https://ieeexplore.ieee.org/abstract/document/10650867">Sparse Attack with Meta-Learning</a>, Weitao Li, Mingqian Lin, <strong>Yihan Meng</strong>, Yangdai Si, Lin Shang.
  </li>
</ul>

<!-- - [Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ornare aliquet ipsum, ac tempus justo dapibus sit amet](https://github.com), A, B, C, **CVPR 2020** -->

# 🎖 Honors and Awards
- *2023.10* President's Scholarship. 
- *2022.10* People's Scholarship. 

# 📖 Educations
- *2023.09 - now*, Ph.D. Candidate, Department of Computer Science and Technology, Nanjing University, Nanjing.
- *2019.09 - 2023.06*, Undergraduate, Department of Computer Science and Technology, Nanjing University, Nanjing. 

<!-- # 💬 Presentations
- 🤓Later. -->

# 💻 Internships
- *2025.07 - now*, [Guodian Nanjing Automation Co.,Ltd](http://www.sac-china.com/), China.

<a id="open-source"></a>
# Open Source

### [Lightweight EPUB Merge Tool](https://github.com/yumizhi/lightweight_epub_merge_tool)

[![Release](https://img.shields.io/github/v/release/yumizhi/lightweight_epub_merge_tool?style=flat-square)](https://github.com/yumizhi/lightweight_epub_merge_tool)
[![Downloads](https://img.shields.io/github/downloads/yumizhi/lightweight_epub_merge_tool/total?style=flat-square)](https://github.com/yumizhi/lightweight_epub_merge_tool/releases)
[![License](https://img.shields.io/github/license/yumizhi/lightweight_epub_merge_tool?style=flat-square)](https://github.com/yumizhi/lightweight_epub_merge_tool/blob/main/LICENSE)
[![Stars](https://img.shields.io/github/stars/yumizhi/lightweight_epub_merge_tool?style=flat-square)](https://github.com/yumizhi/lightweight_epub_merge_tool/stargazers)
[![Forks](https://img.shields.io/github/forks/yumizhi/lightweight_epub_merge_tool?style=flat-square)](https://github.com/yumizhi/lightweight_epub_merge_tool/network/members)

一个针对轻小说多卷 EPUB 的轻量级合并工具：尽量保留插图与章节结构，并重建按卷分组目录（TOC）。

- 合并多卷 EPUB 为合订本，重建按卷分组的总目录（支持 EPUB2/EPUB3）
- 尽量保留文本、插图、CSS 等资源
- 提供 CLI 与 PySide6/Qt GUI
- Releases 提供打包版本可直接运行

**Links:** [Repo](https://github.com/yumizhi/lightweight_epub_merge_tool) ·
[Releases](https://github.com/yumizhi/lightweight_epub_merge_tool/releases) ·
[Docs](https://github.com/yumizhi/lightweight_epub_merge_tool#readme)


