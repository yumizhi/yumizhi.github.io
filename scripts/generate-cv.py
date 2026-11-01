"""Build a compact web CV from verified public homepage facts. Review when content changes."""
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from pathlib import Path
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
pdfmetrics.registerFont(TTFont("CVSans","/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("CVSans-Bold","/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("CVSans-Oblique","/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFontFamily("CVSans",normal="CVSans",bold="CVSans-Bold",italic="CVSans-Oblique",boldItalic="CVSans-Bold")
purple=colors.HexColor('#6A005F'); muted=colors.HexColor('#706873')
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='Name',fontName='CVSans',fontSize=29,leading=34,textColor=purple,spaceAfter=9))
styles.add(ParagraphStyle(name='Contact',fontName='CVSans',fontSize=9,leading=14,textColor=muted,spaceAfter=5))
styles.add(ParagraphStyle(name='Section',fontName='CVSans-Bold',fontSize=12,leading=15,spaceBefore=21,spaceAfter=12,textColor=purple))
styles.add(ParagraphStyle(name='Entry',fontName='CVSans',fontSize=10,leading=15,spaceAfter=8))
styles.add(ParagraphStyle(name='SmallEntry',fontName='CVSans',fontSize=9,leading=14,spaceAfter=10))
story=[]
def p(text,style):story.append(Paragraph(text,styles[style]))
p('Yihan Meng','Name')
p('Ph.D. Candidate | School of Computer Science, Nanjing University','Contact')
p('mengyihan@smail.nju.edu.cn | https://yumizhi.github.io | Nanjing, China','Contact')
p('Research interests: generative models, watermarking, and adversarial learning.','Entry')
p('Education','Section')
p('<b>Nanjing University</b> | Ph.D. in Computer Science and Technology<br/>2023 - Present. Advisor: Associate Professor Lin Shang.','Entry')
p('<b>Nanjing University</b> | B.S. in Computer Science and Technology<br/>2019 - 2023.','Entry')
p('Research Experience','Section')
p('<b>Guodian Nanjing Automation Co., Ltd.</b> | Research Intern<br/>2025 - Present. Enterprise joint training. Nanjing, China.','Entry')
p('Publications','Section')
p('<b>TIDE: Trajectory-Aware Watermark Propagation for Text-to-Image Diffusion Models.</b><br/>Yihan Meng, Suping Xu, Yanfeng Wu, Chongjun Wang, Lin Shang.<br/><i>NeurIPS 2026.</i>','SmallEntry')
p('<b>SASBO: Sparse Attack via Stochastic Binary Optimization.</b><br/>Yihan Meng, Weitao Li, Lin Shang.<br/><i>PAKDD 2024.</i> DOI: 10.1007/978-981-97-2242-6_10.','SmallEntry')
p('<b>Sparse Attack with Meta-Learning.</b><br/>Weitao Li, Mingqian Lin, Yihan Meng, Yangdai Si, Lin Shang.<br/><i>IJCNN 2024.</i>','SmallEntry')
p('Honors and Awards','Section')
p("Outstanding Graduate Student (2025)<br/>President's Scholarship (2023)<br/>People's Scholarship (2022)",'Entry')
p('Open-source Project','Section')
p('<b>EPUB Toolkit.</b> Merge, split, and inspect EPUB collections on your device.<br/>https://github.com/yumizhi/lightweight_epub_merge_tool','SmallEntry')
def footer(c,doc):
 c.setStrokeColor(colors.HexColor('#e7e1e7'));c.line(48,37,547,37);c.setFillColor(muted);c.setFont('CVSans',8);c.drawString(48,25,'Web CV | Updated November 2026');c.drawRightString(547,25,str(doc.page))
SimpleDocTemplate('public/files/yihan-meng-cv.pdf',pagesize=(595.28,841.89),rightMargin=48,leftMargin=48,topMargin=42,bottomMargin=45).build(story,onFirstPage=footer,onLaterPages=footer)
