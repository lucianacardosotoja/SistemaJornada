# 📅 Sistema de Gestão de Escalas e Relatórios - TOJA SOLUÇÕES

Este projeto apresenta o desenvolvimento de um Sistema Digital de Jornada de Trabalho, que visa tornar o controle de ponto, escalas e relatórios mais práticos, seguros e transparentes. Desenvolvido com HTML5, CSS3, JavaScript e Firebase, o sistema pode ser acessado remotamente, aumentando sua usabilidade.

## 🎯 Objetivo do Projeto

Criar um sistema funcional de:

- Registro de ponto digital  
- Definição e organização de escalas de trabalho  
- Acesso diferenciado para administradores e funcionários  
- Geração de relatórios mensais e estatísticas  


## 🚀 Tecnologias Utilizadas

- **HTML5** — Estrutura das páginas  
- **CSS3** — Estilo e responsividade  
- **JavaScript (ES6+)** — Interatividade e lógica  
- **Firebase** — Backend como serviço (BaaS), banco de dados NoSQL e autenticação . 


## ⚙️ Funcionalidades do Sistema

- Autenticação de usuários  
- Perfil de Administrador e Funcionário  
- Registro de entrada e saída digital  
- Calendário interativo de escalas  
- Cadastro e edição de escalas  
- Geração de Relatórios


## 📂 Estrutura de Coleções no Firestore

```plaintext
📁 funcionario
 ┗ 📄 Documento (ID automático ou personalizado)
      ┣ 📄 nome: "João Silva"
      ┣ 📄 email: "joao@email.com"
      ┣ 📄 cargo: "Auxiliar"
      ┣ 📄 dataContratacao: "2025-06-21"
      ┗ 📄 dataNascimento: "1979-09-06"

📁 escalas
 ┗ 📄 Documento
      ┣ 📄 nome: "joao@email.com"
      ┣ 📄 periodo: "Manhã"
      ┗ 📄 data: "2025-06-03"

📁 registros_ponto
 ┗ 📄 Documento
      ┣ 📄 uid: "<ID do funcionário>"
      ┣ 📄 data: "2025-06-03"
      ┗ 📄 horas: 8
```

## 💡 Metodologia

Pesquisa qualitativa, de caráter acadêmico, utilizando:
- Revisão bibliográfica com fontes técnicas e acadêmicas
- Desenvolvimento prático de sistema web
- Abordagem dedutiva, com aplicação de conceitos legais (CLT) e boas práticas de desenvolvimento
- Utilização de tecnologias amplamente aceitas no mercado


## 🧩 Estrutura do Projeto
```
    SistemaJornada/
    ├── index.html    
    ├── readme.md                     
    ├── css/
    │   ├── style.css 
    ├── components/
    │   ├── header.html                 
    │   ├── header_login.html           
    │   └── footer.html                 
    ├── firebase/
    │   └── firebaseConfig.js           
    ├── js/
    │   ├── login.js                    
    │   ├── recuperar_acesso.js         
    │   ├── cadastro.js                 
    │   ├── funcionario/
    │   │   ├── relatorios_horas.js         
    │   │   ├── escalas_semanais_func.js    
    │   │   └── registro_ponto_func.js      
    │   └── admin/
    │       ├── ajustar_pontos.js           
    │       ├── listar_funcionarios.js      
    │       ├── escalas_semanais_admin.js   
    │       └── relatorios_funcionarios.js  
    ├── pages/
    │   ├── admin/
    │   │   ├── ajustar_pontos.html         
    │   │   ├── escalas_semanais_admin.html
    │   │   ├── listar_funcionarios.html    
    │   │   ├── relatorios_funcionarios.html
    │   │   └── home_page_admin.html        
    │   ├── funcionario/
    │   │   ├── escalas_semanais_func.html  
    │   │   ├── registro_ponto_func.html    
    │   │   ├── relatorios_horas.html       
    │   │   └── home_page_func.html         
    │   ├── cadastro.html                  
    │   └── recuperar_acesso.html  
    ├── resource/
    │   ├──  banco_dados.txt  
    │   └──  diretorios.txt          
```

## ⚙️ Configuração Inicial
    
Clone o repositório:
```
        git clone https://github.com/lucianacardosotoja/SistemaJornada.git
```

Configure o Firebase:

1. Crie um projeto no Firebase
2. Habilite o Firestore Database
3. Copie as credenciais e atualize o arquivo firebaseConfig.js

```
    export const firebaseConfig = {
    apiKey: "SUA_CHAVE",
    authDomain: "SEU_DOMINIO",
    projectId: "SEU_PROJETO_ID",
    storageBucket: "SEU_BUCKET",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SUA_APP_ID"
    };
```

4. Abra o projeto no navegador:
5. Abra o arquivo index.html no navegador.


## 🛠️ Próximas Melhorias

- Validação de dados mais robusta
- Responsividade para dispositivos móveis
- Exportação de relatórios em PDF
- Dashboard com gráficos interativos
- Regras de segurança no Firestore para restringir acessos não autorizados
- Integração com outros sistemas corporativos via API, caso necessário
- Logs e monitoramento de alterações para maior controle

## 👩‍💻 Desenvolvido por 
Luciana Cardoso Toja | Projeto Acadêmico - Sistema de Gestão de Escalas e Relatórios
Curso: Analise e Desenvolvimento de Sistemas - Uniasselvi


