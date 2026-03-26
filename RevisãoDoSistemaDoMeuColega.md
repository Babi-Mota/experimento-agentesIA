# Revisão do Sistema do Barbara Mota (https://github.com/Babi-Mota/experimento-agentesIA)

## A Revisão do Sistema

**1. O sistema está funcionando com as funcionalidades solicitadas?**
A análise da estrutura do repositório indica que a arquitetura central necessária para o funcionamento das funcionalidades solicitadas foi estabelecida. O backend foi dividido claramente em módulos, com rotas independentes para gerenciar questões (`questionRoutes.ts`) e provas (`examRoutes.ts`). Os serviços correspondentes cobrem todo o escopo do negócio: desde a manipulação e geração das avaliações (`examGenerationService.ts` e `examService.ts`), passando pela rotina de verificação (`examCorrectionService.ts`), até as emissões e relatórios (como `pdfExportService.ts` e `classReportService.ts`). O frontend acompanha o modelo utilizando React com páginas separadas (`Exams.tsx`, `Questions.tsx`, `Reports.tsx`) para o controle da interface com o usuário.

**2. Quais os problemas de qualidade do código e dos testes?**
O código é organizado e a adoção do TypeScript ajuda na prevenção de erros criando contratos estáticos de tipagem entre as partes da aplicação. O maior problema estrutural, no entanto, é o uso de repositórios em memória (`In-memory repository`) nos serviços do backend. Isso acarreta a perda completa dos dados cadastrados (provas, questões) a cada reinicialização do servidor, sendo uma solução aceitável para um protótipo, mas insustentável para um ambiente produtivo. 
Quanto aos testes, o uso da sintaxe BDD através de arquivos `.feature` (como `exam.feature` e `questions.feature`) é uma escolha excelente para atrelar regras de negócio ao código de maneira legível. Contudo, não há indicativos fortes de testes unitários que aprofundem validações nos casos extremos da lógica matemática de distribuição de pontos e alternativas.

**3. Como a funcionalidade e a qualidade desse sistema pode ser comparada com as do seu sistema?**
A arquitetura escolhida (Node.js, Express, React, TypeScript) é bastante familiar e se alinha à construção clássica de sistemas full-stack. Entretanto, em aplicações focadas no gerenciamento educacional e na correção de provas automatizadas, a utilização de backends em Python, como o FastAPI, normalmente facilita a integração com bibliotecas de visão computacional (como OpenCV e Tesseract) para agregar recursos avançados de reconhecimento óptico de marcas (OMR). O sistema revisado se concentra de forma pragmática e exclusiva no fluxo web interativo tradicional (CRUD), entregando uma experiência ágil no navegador sem depender de infraestruturas complexas de persistência de dados.

---

## A Revisão do Histórico do Desenvolvimento

**1. Estratégias de interação utilizada**
A abordagem principal consistiu em prover todo o contexto simultaneamente ("Zero-shot" estruturado). O prompt indicou claramente um documento base (`SPEC.md`) e solicitou ao agente que criasse a arquitetura backend inteira a partir dele, exigindo de uma só vez a criação da infraestrutura fundamental de pastas, o arquivo do servidor (`server.ts`) e a definição da stack (Node.js, Express e TypeScript).

**2. Situações em que o agente funcionou melhor ou pior**
O agente demonstrou excelente produtividade na fase de inicialização ("scaffolding"). Gerar as configurações pesadas e organizar os arquivos de serviços e rotas evitou horas de trabalho braçal. O lado negativo emergiu na configuração do estado de armazenamento: por não ter recebido instruções determinantes para integrar um banco de dados relacional com ferramentas de migração, o modelo priorizou atalhos para entregar o código executável mais rápido, adotando persistência em memória.

**3. Tipos de problemas observados**
Em abordagens onde o agente precisa idealizar rotas, serviços e servidor em um único passo, costumam surgir pequenas inconsistências em importações relativas e falhas ocasionais ao lidar com pacotes ainda não instalados (necessitando checagem de `package.json` vs imports no código). A estrutura simplificada de armazenamento também impõe a necessidade de futura refatoração manual severa caso se deseje atrelar o sistema a um banco real (como PostgreSQL ou MySQL).

**4. Avaliação geral da utilidade do agente no desenvolvimento**
A utilidade foi muito alta como acelerador do ciclo de desenvolvimento. Ele se destacou na função de estruturar as camadas iniciais de componentes visuais do Vite e no boilerplate de um servidor Express, permitindo ao desenvolvedor investir mais tempo na validação do fluxo das páginas e menos tempo escrevendo as sintaxes de configuração inerentes ao TypeScript.

**5. Comparação com a sua experiência de uso do agente**
O uso de agentes de Inteligência Artificial voltado para arquiteturas de software pode adquirir contornos bastante complexos, como a construção de ecossistemas orquestrados que realizam interações autônomas avançadas e focam proativamente em tarefas intrincadas, como segurança ou visão computacional. Neste projeto avaliado, a colega adotou uma via muito mais direta e prática, tratando o agente fundamentalmente como um "coding copilot". O objetivo foi puramente utilitário: transformar rapidamente um arquivo de especificações em um produto web interativo e funcional em curto espaço de tempo.