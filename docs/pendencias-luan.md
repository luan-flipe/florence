# Pendências que só eu defino (interno)

Não vai pro cliente. Acompanha a rodada 2 (`duvidas-florence-rodada-2.md`).

## Ações minhas
- **Falar com o Giovani Murilo (SMTP):** qual serviço de e-mail usam, remetente dos formulários e quem aplica a senha no painel (eu não manuseio senha).
- **Data de publicação:** o Lucas quer fechar este mês. Definir a data-alvo e trabalhar de trás pra frente (revisão deles, congelamento, migração).

## Decisões técnicas
- **Plano de migração pro oficial:** como portar tema, mu-plugin `florence-modelo.php` e dados (CPT curso + ACF) para florence.edu.br sem derrubar o site. Inclui backup completo, reimportar o corpo docente a partir do oficial e purgar o cache do Cloudflare.
- **Licença do Elementor Pro:** a abordagem aprovada depende do Theme Builder. Confirmar se a licença é válida ou se seguimos só com templates PHP do tema.
- **Toolset:** quando aposentar de vez (desativar no oficial) e o que fazer com os CPTs legados depois da migração.

## Arrumação de dados (faço sem depender deles)
- **28 cursos sem `nivel`** no CPT curso: não aparecem nos filtros da listagem. Classificar e conferir.
- **Cursos livres duplicados:** 25 posts nos CPTs legados `curso-livre-20/30/40-hora`, que já foram migrados pro CPT curso. Limpar depois da publicação.

## Recomendações que preciso fechar antes de mandar
- **Newsletter:** minha recomendação é não ter, a menos que exista alguém pra alimentar (já foi assim na rodada 2).
- **Páginas pra cortar/fundir (item 8 da rodada 2):** confirmar se a lista é essa mesmo antes de enviar.
