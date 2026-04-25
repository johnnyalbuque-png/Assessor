from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_LEFT

W, H = A4
AZUL = colors.HexColor('#1B3A6B')
AZUL_MED = colors.HexColor('#2E86AB')
CINZA = colors.HexColor('#F5F7FA')
CINZA_ESC = colors.HexColor('#CCCCCC')
BRANCO = colors.white

doc = SimpleDocTemplate(
    '/home/user/Assessor/VitrinaISP-Apresentacao.pdf',
    pagesize=A4,
    rightMargin=2*cm, leftMargin=2*cm,
    topMargin=2*cm, bottomMargin=2*cm
)

styles = getSampleStyleSheet()

def estilo(nome, **kw):
    return ParagraphStyle(nome, **kw)

titulo_capa = estilo('tc', fontSize=36, textColor=BRANCO, alignment=TA_CENTER, fontName='Helvetica-Bold', leading=44)
sub_capa = estilo('sc', fontSize=16, textColor=AZUL_MED, alignment=TA_CENTER, fontName='Helvetica', leading=24)
titulo_sec = estilo('ts', fontSize=18, textColor=BRANCO, alignment=TA_LEFT, fontName='Helvetica-Bold', leading=24)
corpo = estilo('co', fontSize=11, textColor=colors.HexColor('#333333'), fontName='Helvetica', leading=18)
corpo_bold = estilo('cb', fontSize=11, textColor=colors.HexColor('#333333'), fontName='Helvetica-Bold', leading=18)
item = estilo('it', fontSize=11, textColor=colors.HexColor('#333333'), fontName='Helvetica', leading=18, leftIndent=15)
rodape_st = estilo('ro', fontSize=9, textColor=colors.HexColor('#888888'), alignment=TA_CENTER, fontName='Helvetica')

def cabecalho_secao(texto):
    data = [[Paragraph(texto, titulo_sec)]]
    t = Table(data, colWidths=[17*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), AZUL),
        ('ROWPADDING', (0,0), (-1,-1), 10),
        ('ROUNDEDCORNERS', [4,4,4,4]),
    ]))
    return t

def tabela(cabecalhos, linhas, col_widths=None):
    data = [[Paragraph(c, estilo('th', fontSize=10, textColor=BRANCO, fontName='Helvetica-Bold', leading=14)) for c in cabecalhos]]
    for i, linha in enumerate(linhas):
        data.append([Paragraph(str(c), estilo('td', fontSize=10, textColor=colors.HexColor('#333333'), fontName='Helvetica', leading=14)) for c in linha])

    if not col_widths:
        col_widths = [17*cm / len(cabecalhos)] * len(cabecalhos)

    t = Table(data, colWidths=col_widths, repeatRows=1)
    style = [
        ('BACKGROUND', (0,0), (-1,0), AZUL_MED),
        ('GRID', (0,0), (-1,-1), 0.5, CINZA_ESC),
        ('ROWPADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]
    for i in range(1, len(data)):
        bg = CINZA if i % 2 == 0 else BRANCO
        style.append(('BACKGROUND', (0,i), (-1,i), bg))
    t.setStyle(TableStyle(style))
    return t

def hr():
    return HRFlowable(width='100%', thickness=1, color=AZUL_MED, spaceAfter=10, spaceBefore=10)

story = []

# ─── CAPA ───
story.append(Spacer(1, 3*cm))
capa_data = [[Paragraph('VITRINE ISP', titulo_capa)]]
capa_t = Table(capa_data, colWidths=[17*cm])
capa_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), AZUL),
    ('ROWPADDING', (0,0), (-1,-1), 30),
]))
story.append(capa_t)
story.append(Spacer(1, 1*cm))
story.append(Paragraph('O marketplace curado do mercado ISP brasileiro', sub_capa))
story.append(Spacer(1, 0.5*cm))
story.append(Paragraph('Apresentado por Johnny · INTER\'ISP', estilo('au', fontSize=13, textColor=colors.HexColor('#555555'), alignment=TA_CENTER, fontName='Helvetica')))
story.append(Spacer(1, 0.5*cm))
story.append(Paragraph('Abril 2026', estilo('dt', fontSize=11, textColor=colors.HexColor('#888888'), alignment=TA_CENTER, fontName='Helvetica')))
story.append(Spacer(1, 4*cm))
story.append(hr())
story.append(Paragraph('Documento Confidencial · Uso Interno', rodape_st))

# ─── O QUE É ───
story.append(Spacer(1, 1*cm))
story.append(cabecalho_secao('1. O que é a Vitrine ISP'))
story.append(Spacer(1, 0.4*cm))
story.append(Paragraph(
    'A <b>Vitrine ISP</b> é um diretório online curado onde fornecedores do mercado de provedores de internet '
    'pagam mensalmente para ter um perfil profissional e ser encontrados por donos de provedores (ISPs) em todo o Brasil.',
    corpo))
story.append(Spacer(1, 0.3*cm))
story.append(Paragraph('<b>Proposta de valor:</b>', corpo_bold))
story.append(Paragraph('• Para fornecedores: acesso direto a +30.000 provedores qualificados, com a credibilidade do nome INTER\'ISP.', item))
story.append(Paragraph('• Para provedores: encontrar fornecedores confiáveis, curados por quem mais conhece o setor — sem depender de eventos.', item))
story.append(Paragraph('• Para Johnny: receita recorrente mensal usando o relacionamento e autoridade que já possui.', item))
story.append(Spacer(1, 0.4*cm))
story.append(Paragraph(
    'O diferencial central é a <b>curadoria</b>. Não é um Google de fornecedores — é a recomendação de quem '
    'esteve em mais de 200 eventos e conhece pessoalmente cada empresa listada.',
    corpo))

# ─── COMO FUNCIONA: FORNECEDOR ───
story.append(Spacer(1, 0.8*cm))
story.append(cabecalho_secao('2. Como funciona — Lado Fornecedor'))
story.append(Spacer(1, 0.4*cm))
story.append(Paragraph('<b>Fluxo do fornecedor:</b>', corpo_bold))
passos_forn = [
    ['1', 'Johnny contata o fornecedor (já conhece todos pessoalmente dos eventos)'],
    ['2', 'Fornecedor escolhe um plano e realiza o pagamento mensal'],
    ['3', 'Preenche o perfil: produtos, regiões, contato, vídeo, certificações'],
    ['4', 'Perfil entra no ar com o Selo INTER\'ISP de fornecedor verificado'],
    ['5', 'Provedores encontram, acessam o perfil e entram em contato diretamente'],
    ['6', 'Fornecedor recebe leads qualificados do nicho ISP'],
]
story.append(tabela(['Etapa', 'Descrição'], passos_forn, [2*cm, 15*cm]))
story.append(Spacer(1, 0.4*cm))
story.append(Paragraph('<b>O que o fornecedor recebe no perfil:</b>', corpo_bold))
story.append(Paragraph('• Logo e banner da empresa', item))
story.append(Paragraph('• Descrição completa de produtos e serviços', item))
story.append(Paragraph('• Regiões atendidas', item))
story.append(Paragraph('• Contato direto: WhatsApp, e-mail e site', item))
story.append(Paragraph('• Vídeo institucional', item))
story.append(Paragraph('• Avaliações de provedores clientes', item))
story.append(Paragraph('• Selo "Verificado INTER\'ISP" e badge "Recomendado por Johnny" (plano Premium)', item))

# ─── COMO FUNCIONA: PROVEDOR ───
story.append(Spacer(1, 0.8*cm))
story.append(cabecalho_secao('3. Como funciona — Lado Provedor'))
story.append(Spacer(1, 0.4*cm))
story.append(Paragraph('<b>Fluxo do provedor:</b>', corpo_bold))
passos_prov = [
    ['1', 'Johnny dispara e-mail para sua lista de +30.000 provedores anunciando a plataforma'],
    ['2', 'Provedor cria conta gratuita no site'],
    ['3', 'Busca fornecedor por categoria, região ou produto'],
    ['4', 'Compara opções, lê avaliações e acessa o contato direto'],
    ['5', 'Entra em contato com o fornecedor sem intermediários'],
    ['6', 'Deixa avaliação após contratar — alimenta a reputação da plataforma'],
]
story.append(tabela(['Etapa', 'Descrição'], passos_prov, [2*cm, 15*cm]))
story.append(Spacer(1, 0.4*cm))
story.append(Paragraph(
    'O acesso do provedor é <b>gratuito</b>. O fornecedor subsidia a plataforma. '
    'Isso garante volume de usuários desde o lançamento, já que não há barreira de entrada.',
    corpo))

# ─── CATEGORIAS ───
story.append(Spacer(1, 0.8*cm))
story.append(cabecalho_secao('4. Categorias da Plataforma'))
story.append(Spacer(1, 0.4*cm))
cats = [
    ['01', 'Equipamentos', 'OLTs, switches, roteadores, antenas'],
    ['02', 'Fibra óptica e infraestrutura', 'Cabos, conectores, splitters, ferramentas'],
    ['03', 'Software de gestão', 'Billing, ERP, CRM para provedores'],
    ['04', 'Monitoramento e NOC', 'Ferramentas de monitoramento de rede'],
    ['05', 'Segurança e firewall', 'Soluções de cybersegurança para ISPs'],
    ['06', 'Energia', 'Nobreaks, geradores, proteção elétrica'],
    ['07', 'Treinamento e capacitação', 'Cursos técnicos para equipes de provedores'],
    ['08', 'Jurídico e regulatório', 'Compliance com Anatel, outorgas'],
    ['09', 'Marketing para provedores', 'Agências e ferramentas de marketing'],
    ['10', 'Financiamento e crédito', 'Linhas de crédito e financiamento para ISPs'],
]
story.append(tabela(['#', 'Categoria', 'Exemplos de produtos'], cats, [1.5*cm, 6*cm, 9.5*cm]))

# ─── MODELO DE RECEITA ───
story.append(Spacer(1, 0.8*cm))
story.append(cabecalho_secao('5. Modelo de Receita'))
story.append(Spacer(1, 0.4*cm))
story.append(Paragraph('<b>Planos para fornecedores (receita principal):</b>', corpo_bold))
planos = [
    ['Básico', 'R$ 297/mês', 'Perfil completo, listado na categoria, Selo INTER\'ISP'],
    ['Destaque', 'R$ 597/mês', 'Aparece primeiro na categoria, badge de destaque'],
    ['Premium', 'R$ 997/mês', 'Topo absoluto, banner na home, tag "Recomendado por Johnny", 1 menção na newsletter/mês'],
]
story.append(tabela(['Plano', 'Preço', 'O que inclui'], planos, [3*cm, 3.5*cm, 10.5*cm]))
story.append(Spacer(1, 0.4*cm))
story.append(Paragraph('<b>Receitas secundárias:</b>', corpo_bold))
sec = [
    ['Patrocínio de categoria', 'R$ 2.000–5.000/mês', 'Fornecedor exclusivo em uma categoria'],
    ['Menção extra na newsletter', 'R$ 500–1.500', 'Por edição enviada'],
    ['Destaque no evento INTER\'ISP', 'R$ 1.000–3.000', 'Por evento realizado'],
    ['Provedor Premium', 'R$ 29,90/mês', 'Filtros avançados, sistema de cotações'],
]
story.append(tabela(['Fonte', 'Valor', 'Descrição'], sec, [5*cm, 4*cm, 8*cm]))

# ─── PROJEÇÃO FINANCEIRA ───
story.append(Spacer(1, 0.8*cm))
story.append(cabecalho_secao('6. Projeção Financeira'))
story.append(Spacer(1, 0.4*cm))
proj = [
    ['Lançamento (mês 1)', '20 fornecedores', 'Mix de planos', '~R$ 9.000/mês'],
    ['3 meses', '50 fornecedores', '+ patrocínios iniciais', '~R$ 22.000/mês'],
    ['6 meses', '100 fornecedores', '+ provedores premium', '~R$ 45.000/mês'],
    ['12 meses', '200 fornecedores', '+ patrocínios de categoria', '~R$ 100.000/mês'],
]
story.append(tabela(['Cenário', 'Fornecedores', 'Fontes adicionais', 'Receita estimada'], proj, [3.5*cm, 4*cm, 5*cm, 4.5*cm]))
story.append(Spacer(1, 0.4*cm))
story.append(Paragraph(
    '<b>Investimento inicial estimado:</b> R$ 5.000–15.000 (desenvolvimento do MVP). '
    '<b>Payback:</b> mês 1 ou 2, pois a venda começa pelos fornecedores que Johnny já conhece.',
    corpo))

# ─── GO-TO-MARKET ───
story.append(Spacer(1, 0.8*cm))
story.append(cabecalho_secao('7. Estratégia de Lançamento (Go-to-Market)'))
story.append(Spacer(1, 0.4*cm))
gtm = [
    ['Fase 1 — Mês 1', 'Construção + Fornecedores Fundadores',
     'Montar o MVP. Convidar 15–20 fornecedores conhecidos com 50% de desconto nos primeiros 3 meses. Eles validam e já geram receita inicial.'],
    ['Fase 2 — Mês 2', 'Abertura para Provedores',
     'Disparar e-mail para a lista de 30.000 provedores. Acesso gratuito. Fornecedores começam a receber leads qualificados.'],
    ['Fase 3 — Mês 3+', 'Escala',
     'Captar novos fornecedores presencialmente nos eventos INTER\'ISP. Lançar plano premium para provedores. Ativar patrocínios de categoria.'],
]
story.append(tabela(['Fase', 'Foco', 'Ações'], gtm, [3*cm, 4.5*cm, 9.5*cm]))

# ─── PAINEL ADM + TECH ───
story.append(Spacer(1, 0.8*cm))
story.append(cabecalho_secao('8. Painel Administrativo e Tecnologia'))
story.append(Spacer(1, 0.4*cm))
story.append(Paragraph('<b>O que o painel administrativo permite:</b>', corpo_bold))
adm = [
    ['Fornecedores', 'Adicionar, editar, ativar/desativar perfis, definir plano, marcar "Recomendado por Johnny"'],
    ['Categorias', 'Criar e editar categorias e subcategorias'],
    ['Provedores', 'Ver lista de cadastrados, acessos e comportamento'],
    ['Métricas', 'Cliques por fornecedor, provedores cadastrados, leads gerados'],
    ['Financeiro', 'Controle de assinaturas ativas por fornecedor'],
]
story.append(tabela(['Módulo', 'Funcionalidades'], adm, [4*cm, 13*cm]))
story.append(Spacer(1, 0.4*cm))
story.append(Paragraph('<b>Stack tecnológica (MVP):</b>', corpo_bold))
tech = [
    ['Frontend + Backend', 'Next.js (React)', 'Moderno, rápido, hospedagem gratuita na Vercel'],
    ['Banco de dados', 'Supabase (PostgreSQL)', 'Gratuito até escalar, autenticação inclusa'],
    ['Pagamentos', 'Stripe ou Kiwify', 'Recorrência automática, boleto e cartão'],
    ['Hospedagem', 'Vercel', 'Gratuita no início, escalável'],
    ['Infra mensal', '—', 'R$ 200–500/mês'],
]
story.append(tabela(['Camada', 'Tecnologia', 'Por quê'], tech, [4*cm, 4.5*cm, 8.5*cm]))

# ─── RESUMO ───
story.append(Spacer(1, 0.8*cm))
story.append(cabecalho_secao('9. Resumo Executivo'))
story.append(Spacer(1, 0.4*cm))
resumo = [
    ['Produto', 'Diretório curado de fornecedores para o mercado ISP'],
    ['Quem paga', 'Fornecedores (R$ 297–997/mês) — receita principal'],
    ['Quem usa grátis', 'Provedores de internet (+30.000 no mailing de Johnny)'],
    ['Diferencial', 'Curadoria e autoridade do Johnny no setor (10 anos, +200 eventos)'],
    ['Investimento inicial', 'R$ 5.000–15.000 (desenvolvimento MVP)'],
    ['Receita mês 1', '~R$ 9.000 (20 fornecedores fundadores)'],
    ['Receita potencial', 'R$ 100.000+/mês em 12 meses'],
    ['Payback', 'Mês 1 ou 2'],
    ['Custo operacional', 'R$ 200–500/mês (infra) + freelancer de suporte'],
]
story.append(tabela(['Item', 'Detalhe'], resumo, [5*cm, 12*cm]))
story.append(Spacer(1, 0.4*cm))
story.append(hr())
story.append(Paragraph(
    'Próximos passos: definir nome de domínio · desenvolver MVP · abordar fornecedores fundadores · lançar para a lista de provedores.',
    estilo('ps', fontSize=11, textColor=AZUL, fontName='Helvetica-Bold', alignment=TA_CENTER, leading=18)))
story.append(Spacer(1, 0.3*cm))
story.append(Paragraph('Johnny · INTER\'ISP · @inter.isp · Abril 2026', rodape_st))

doc.build(story)
print("PDF gerado com sucesso!")
