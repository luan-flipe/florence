-- Florence — Migration 004: Seed de dados de demonstração
-- Criado em: 15/05/2026
--
-- Popula o banco com 35 leads diversos para testar o dashboard:
--   - Cursos: medicina (majoritário), enfermagem, direito
--   - UTMs: facebook, google, instagram, direto (NULL), indicação
--   - Datas: espalhadas nos últimos 60 dias
--   - Status: distribuição realista pelo funil (novo → perdido)
--   - Atribuições: parte dos leads atribuída ao super_admin
--   - Comentários: 10 comentários em leads ativos
--
-- O trigger log_status_change registra automaticamente em lead_status_history
-- toda transição de status, então o histórico será populado naturalmente.

-- ─── LEADS ─────────────────────────────────────────────────────

insert into leads (name, email, phone, course, utm_source, utm_medium, utm_campaign, created_at) values
  -- Recentes (últimas 24h)
  ('João Pedro Silva',       'joao.silva@gmail.com',         '(98) 98765-4321', 'medicina',   'facebook',  'paid_social', 'vestibular_2026',   now() - interval '2 hours'),
  ('Maria Eduarda Santos',   'maria.eduarda@gmail.com',      '(98) 99876-5432', 'medicina',   'google',    'cpc',         'medicina_2026',     now() - interval '5 hours'),
  ('Carlos Henrique Costa',  'carlos.costa@hotmail.com',     '(98) 98123-4567', 'medicina',   'instagram', 'paid_social', 'vestibular_2026',   now() - interval '8 hours'),
  ('Ana Carolina Oliveira',  'ana.oliveira@gmail.com',       '(98) 99234-5678', 'medicina',   'facebook',  'paid_social', 'medicina_2026',     now() - interval '14 hours'),
  ('Lucas Ferreira',         'lucas.ferreira@gmail.com',     '(98) 98345-6789', 'enfermagem', 'google',    'cpc',         'enfermagem_2026',   now() - interval '22 hours'),

  -- Últimos 7 dias
  ('Beatriz Lima',           'bia.lima@outlook.com',         '(98) 99456-7890', 'medicina',   'facebook',  'paid_social', 'vestibular_2026',   now() - interval '1 day'),
  ('Rafael Pereira',         'rafael.pereira@gmail.com',     '(98) 98567-8901', 'medicina',   null,        null,          null,                now() - interval '2 days'),
  ('Juliana Alves',          'juliana.alves@gmail.com',      '(98) 99678-9012', 'medicina',   'google',    'organic',     null,                now() - interval '2 days'),
  ('Bruno Carvalho',         'bruno.carvalho@gmail.com',     '(98) 98789-0123', 'direito',    'facebook',  'paid_social', 'direito_2026',      now() - interval '3 days'),
  ('Fernanda Mendes',        'fernanda.mendes@hotmail.com',  '(98) 99890-1234', 'medicina',   'instagram', 'paid_social', 'medicina_2026',     now() - interval '3 days'),
  ('Thiago Rocha',           'thiago.rocha@gmail.com',       '(98) 98901-2345', 'medicina',   'facebook',  'paid_social', 'vestibular_2026',   now() - interval '4 days'),
  ('Camila Sousa',           'camila.sousa@gmail.com',       '(98) 99012-3456', 'medicina',   'google',    'cpc',         'medicina_2026',     now() - interval '5 days'),
  ('Vinícius Ramos',         'vinicius.ramos@gmail.com',     '(98) 98123-7890', 'enfermagem', 'instagram', 'paid_social', 'enfermagem_2026',   now() - interval '5 days'),
  ('Larissa Cardoso',        'larissa.cardoso@outlook.com',  '(98) 99234-7891', 'medicina',   'facebook',  'paid_social', 'vestibular_2026',   now() - interval '6 days'),
  ('Pedro Henrique Dias',    'pedro.dias@gmail.com',         '(98) 98345-7892', 'medicina',   null,        null,          'indicacao',         now() - interval '6 days'),
  ('Isabela Martins',        'isabela.martins@gmail.com',    '(98) 99456-7893', 'medicina',   'google',    'cpc',         'medicina_2026',     now() - interval '7 days'),

  -- 8-15 dias
  ('Gabriel Nunes',          'gabriel.nunes@gmail.com',      '(98) 98567-7894', 'medicina',   'facebook',  'paid_social', 'vestibular_2026',   now() - interval '8 days'),
  ('Leticia Barros',         'leticia.barros@gmail.com',     '(98) 99678-7895', 'direito',    'instagram', 'paid_social', 'direito_2026',      now() - interval '9 days'),
  ('Mateus Almeida',         'mateus.almeida@hotmail.com',   '(98) 98789-7896', 'medicina',   'google',    'organic',     null,                now() - interval '10 days'),
  ('Sofia Cunha',            'sofia.cunha@gmail.com',        '(98) 99890-7897', 'medicina',   'facebook',  'paid_social', 'medicina_2026',     now() - interval '11 days'),
  ('Felipe Moreira',         'felipe.moreira@gmail.com',     '(98) 98901-7898', 'medicina',   'instagram', 'paid_social', 'vestibular_2026',   now() - interval '12 days'),
  ('Mariana Ribeiro',        'mariana.ribeiro@gmail.com',    '(98) 99012-7899', 'medicina',   null,        null,          null,                now() - interval '13 days'),
  ('Eduardo Pinto',          'eduardo.pinto@gmail.com',      '(98) 98123-8901', 'enfermagem', 'google',    'cpc',         'enfermagem_2026',   now() - interval '14 days'),
  ('Amanda Vieira',          'amanda.vieira@outlook.com',    '(98) 99234-8902', 'medicina',   'facebook',  'paid_social', 'vestibular_2026',   now() - interval '15 days'),

  -- 16-30 dias
  ('Ricardo Gomes',          'ricardo.gomes@gmail.com',      '(98) 98345-8903', 'medicina',   'instagram', 'paid_social', 'medicina_2026',     now() - interval '17 days'),
  ('Daniela Castro',         'daniela.castro@gmail.com',     '(98) 99456-8904', 'medicina',   'facebook',  'paid_social', 'vestibular_2026',   now() - interval '19 days'),
  ('Henrique Soares',        'henrique.soares@hotmail.com',  '(98) 98567-8905', 'direito',    'google',    'cpc',         'direito_2026',      now() - interval '21 days'),
  ('Patricia Lopes',         'patricia.lopes@gmail.com',     '(98) 99678-8906', 'medicina',   null,        null,          'indicacao',         now() - interval '23 days'),
  ('Andre Teixeira',         'andre.teixeira@gmail.com',     '(98) 98789-8907', 'medicina',   'facebook',  'paid_social', 'medicina_2026',     now() - interval '25 days'),
  ('Carolina Freitas',       'carolina.freitas@gmail.com',   '(98) 99890-8908', 'medicina',   'instagram', 'paid_social', 'vestibular_2026',   now() - interval '27 days'),

  -- 30-60 dias (matriculados / perdidos)
  ('Roberto Cavalcanti',     'roberto.cavalcanti@gmail.com', '(98) 98901-8909', 'medicina',   'google',    'cpc',         'medicina_2025',     now() - interval '35 days'),
  ('Luana Magalhaes',        'luana.magalhaes@gmail.com',    '(98) 99012-8910', 'medicina',   'facebook',  'paid_social', 'vestibular_2025',   now() - interval '38 days'),
  ('Diego Tavares',          'diego.tavares@outlook.com',    '(98) 98123-8911', 'enfermagem', null,        null,          null,                now() - interval '42 days'),
  ('Renata Borges',          'renata.borges@gmail.com',      '(98) 99234-8912', 'medicina',   'instagram', 'paid_social', 'medicina_2025',     now() - interval '48 days'),
  ('Marcelo Faria',          'marcelo.faria@gmail.com',      '(98) 98345-8913', 'medicina',   'facebook',  'paid_social', 'vestibular_2025',   now() - interval '55 days');

-- ─── ATRIBUIÇÃO ao super_admin ──────────────────────────────────

update leads set assigned_to = (select id from user_profiles where role = 'super_admin' limit 1)
where email in (
  'maria.eduarda@gmail.com',
  'bia.lima@outlook.com',
  'rafael.pereira@gmail.com',
  'thiago.rocha@gmail.com',
  'larissa.cardoso@outlook.com',
  'gabriel.nunes@gmail.com',
  'sofia.cunha@gmail.com',
  'ricardo.gomes@gmail.com',
  'roberto.cavalcanti@gmail.com',
  'luana.magalhaes@gmail.com'
);

-- ─── PROGRESSÃO DE STATUS (move leads pelo funil) ──────────────
-- O trigger log_status_change registra a transição automaticamente.

update lead_status set status = 'contactado'
where lead_id in (
  select id from leads where email in (
    'maria.eduarda@gmail.com',
    'ana.oliveira@gmail.com',
    'bia.lima@outlook.com',
    'rafael.pereira@gmail.com',
    'juliana.alves@gmail.com',
    'fernanda.mendes@hotmail.com',
    'camila.sousa@gmail.com',
    'pedro.dias@gmail.com',
    'isabela.martins@gmail.com',
    'amanda.vieira@outlook.com'
  )
);

update lead_status set status = 'em_conversa'
where lead_id in (
  select id from leads where email in (
    'thiago.rocha@gmail.com',
    'larissa.cardoso@outlook.com',
    'gabriel.nunes@gmail.com',
    'sofia.cunha@gmail.com',
    'ricardo.gomes@gmail.com',
    'daniela.castro@gmail.com'
  )
);

update lead_status set status = 'matricula_iniciada'
where lead_id in (
  select id from leads where email in (
    'felipe.moreira@gmail.com',
    'patricia.lopes@gmail.com',
    'andre.teixeira@gmail.com'
  )
);

update lead_status set status = 'matriculado'
where lead_id in (
  select id from leads where email in (
    'roberto.cavalcanti@gmail.com',
    'luana.magalhaes@gmail.com'
  )
);

update lead_status set status = 'perdido'
where lead_id in (
  select id from leads where email in (
    'bruno.carvalho@gmail.com',
    'leticia.barros@gmail.com',
    'mateus.almeida@hotmail.com',
    'henrique.soares@hotmail.com',
    'diego.tavares@outlook.com',
    'renata.borges@gmail.com',
    'marcelo.faria@gmail.com'
  )
);

-- ─── COMENTÁRIOS ────────────────────────────────────────────────

insert into comments (lead_id, user_id, text, created_at)
select
  l.id,
  (select id from user_profiles where role = 'super_admin' limit 1),
  c.text,
  l.created_at + (c.delay_hours || ' hours')::interval
from (values
  ('maria.eduarda@gmail.com',     'Cliente bastante interessada. Já mandou histórico do ENEM, pediu retorno na sexta para falar sobre bolsa.',  6),
  ('thiago.rocha@gmail.com',      'Conversamos por WhatsApp, vai trazer os documentos amanhã.',                                                 24),
  ('thiago.rocha@gmail.com',      'Trouxe a documentação. Encaminhei para análise da bolsa.',                                                   48),
  ('larissa.cardoso@outlook.com', 'Mãe ligou pedindo informações financeiras. Mandei tabela de mensalidades.',                                  12),
  ('gabriel.nunes@gmail.com',     'Marcou visita ao campus para terça-feira.',                                                                  36),
  ('felipe.moreira@gmail.com',    'Iniciou processo de matrícula online. Aguardando comprovante de pagamento da matrícula.',                    72),
  ('roberto.cavalcanti@gmail.com','Matrícula confirmada! Pagamento da primeira mensalidade compensado.',                                        96),
  ('luana.magalhaes@gmail.com',   'Matriculada via FIES. Encaminhamento para coordenação do curso já feito.',                                  120),
  ('bruno.carvalho@gmail.com',    'Não retornou mais as ligações. Marcando como perdido.',                                                     168),
  ('marcelo.faria@gmail.com',     'Optou pela concorrência. Citou preço como motivo principal.',                                               240)
) as c(email, text, delay_hours)
join leads l on l.email = c.email;

-- Reset do schema cache do PostgREST
notify pgrst, 'reload schema';
