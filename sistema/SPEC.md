# Sistema de Geração de Provas

## Objetivo
Sistema web para gerenciar questões fechadas e provas, gerar provas individualizadas, corrigir respostas e emitir relatório de notas.

## Stack
- Frontend: React + TypeScript
- Backend: Node.js + TypeScript
- Testes de aceitação: Cucumber/Gherkin

## Funcionalidades
### Questões
- Cadastrar questão fechada
- Editar questão
- Remover questão
- Listar questões
- Cada questão deve ter enunciado e alternativas
- Cada alternativa deve indicar se é correta ou incorreta

### Provas
- Cadastrar prova
- Editar prova
- Remover prova
- Listar provas
- Associar questões à prova
- Definir formato da resposta: letras ou potências de 2

### Geração
- Gerar PDFs de provas individualizadas
- Embaralhar ordem das questões
- Embaralhar ordem das alternativas
- Gerar CSV com gabarito

### Correção
- Corrigir provas com base em CSV de respostas
- Modo rigoroso
- Modo proporcional

### Relatórios
- Gerar relatório de notas da turma