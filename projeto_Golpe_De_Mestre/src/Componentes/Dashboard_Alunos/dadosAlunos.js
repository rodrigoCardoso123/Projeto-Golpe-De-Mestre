// Dados de exemplo dos alunos. Depois será substituído pelos dados da API.
// A imagem de cada faixa fica na pasta public/ (ex.: "/Faixa - branca.png").

const alunos = [
    {
        id: 1,
        iniciais: "AD",
        nome: "Ana",
        categoria: "Infantil",
        turma: "Turma A",
        situacao: "Ativo",
        presenca: 88,
        faltas: 1,
        avaliacoes: 0,
        faixa: { nome: "Branca", graus: 0, imagem: "/Faixa - branca.png" },
        perfil: {
            matricula: "12/04/2015",
            ultimaGraduacao: "10/11/2026",
            professor: "Professor A",
            programaAuxiliar: "—",
            idade: 11,
            nomeMae: "Maria",
            nomePai: null,
            escola: "Escola Exemplo",
            telefone: "(00) 90000-0000 · exemplo",
            endereco: "Rua Exemplo, 100 - Centro - Cidade Exemplo",
            documentoAluno: "identidade-aluno-exemplo.pdf",
            documentoResponsavel: "documento-responsavel-exemplo.pdf"
        }
    },
    {
        id: 2,
        iniciais: "BD",
        nome: "Bruno",
        categoria: "Juvenil",
        turma: "Turma B",
        situacao: "Ativo",
        presenca: 88,
        faltas: 0,
        avaliacoes: 0,
        faixa: { nome: "Cinza", graus: 1, imagem: "/Faixa - cinza.png" },
        perfil: {
            matricula: "03/02/2024",
            ultimaGraduacao: "05/09/2026",
            professor: "Professor B",
            programaAuxiliar: "—",
            idade: 13,
            nomeMae: "Carla",
            nomePai: "Sérgio",
            escola: "E.M. Vila Nova",
            telefone: "(11) 91234-5678 · exemplo",
            endereco: "Av. Central, 250 - Centro - Cidade Exemplo",
            documentoAluno: "identidade-bruno-exemplo.pdf",
            documentoResponsavel: "documento-responsavel-bruno-exemplo.pdf"
        }
    },
    {
        id: 3,
        iniciais: "CD",
        nome: "Clara",
        categoria: "Infantil",
        turma: "Turma A",
        situacao: "Ativo",
        presenca: 88,
        faltas: 2,
        avaliacoes: 0,
        faixa: { nome: "Amarela", graus: 2, imagem: "/Faixa - amarela.png" },
        perfil: {
            matricula: "15/03/2023",
            ultimaGraduacao: "20/08/2026",
            professor: "Professora C",
            programaAuxiliar: "—",
            idade: 9,
            nomeMae: "Fernanda",
            nomePai: null,
            escola: "Escola Exemplo",
            telefone: "(21) 92345-6789 · exemplo",
            endereco: "Rua das Flores, 45 - Jardim - Cidade Exemplo",
            documentoAluno: "identidade-clara-exemplo.pdf",
            documentoResponsavel: "documento-responsavel-clara-exemplo.pdf"
        }
    },
    {
        id: 4,
        iniciais: "DD",
        nome: "Davi",
        categoria: "Juvenil",
        turma: "Turma B",
        situacao: "Ativo",
        presenca: 88,
        faltas: 1,
        avaliacoes: 0,
        faixa: { nome: "Laranja", graus: 3, imagem: "/Faixa - laranja.png" },
        perfil: {
            matricula: "10/02/2022",
            ultimaGraduacao: "01/07/2026",
            professor: "Professor B",
            programaAuxiliar: "—",
            idade: 14,
            nomeMae: "Patrícia",
            nomePai: "Marcos",
            escola: "Colégio Integrado",
            telefone: "(31) 93456-7890 · exemplo",
            endereco: "Rua do Campo, 300 - Zona Rural - Cidade Exemplo",
            documentoAluno: "identidade-davi-exemplo.pdf",
            documentoResponsavel: "documento-responsavel-davi-exemplo.pdf"
        }
    },
    {
        id: 5,
        iniciais: "ED",
        nome: "Elisa",
        categoria: "Infantil",
        turma: "Turma A",
        situacao: "Ativo",
        presenca: 88,
        faltas: 0,
        avaliacoes: 0,
        faixa: { nome: "Verde", graus: 0, imagem: "/Faixa - verde.png" },
        perfil: {
            matricula: "08/04/2024",
            ultimaGraduacao: "12/10/2026",
            professor: "Professora C",
            programaAuxiliar: "—",
            idade: 10,
            nomeMae: "Juliana",
            nomePai: null,
            escola: "E.M. Boa Vista",
            telefone: "(41) 94567-8901 · exemplo",
            endereco: "Travessa Bela, 12 - Centro - Cidade Exemplo",
            documentoAluno: "identidade-elisa-exemplo.pdf",
            documentoResponsavel: "documento-responsavel-elisa-exemplo.pdf"
        }
    },
    {
        id: 6,
        iniciais: "FD",
        nome: "Felipe",
        categoria: "Juvenil",
        turma: "Turma B",
        situacao: "Ativo",
        presenca: 88,
        faltas: 1,
        avaliacoes: 0,
        faixa: { nome: "Branca", graus: 1, imagem: "/Faixa - branca.png" },
        perfil: {
            matricula: "22/02/2023",
            ultimaGraduacao: "03/09/2026",
            professor: "Professor A",
            programaAuxiliar: "—",
            idade: 12,
            nomeMae: "Renata",
            nomePai: "André",
            escola: "Colégio Integrado",
            telefone: "(51) 95678-9012 · exemplo",
            endereco: "Alameda Santos, 77 - Industrial - Cidade Exemplo",
            documentoAluno: "identidade-felipe-exemplo.pdf",
            documentoResponsavel: "documento-responsavel-felipe-exemplo.pdf"
        }
    },
    {
        id: 7,
        iniciais: "GD",
        nome: "Gabriela",
        categoria: "Infantil",
        turma: "Turma A",
        situacao: "Ativo",
        presenca: 75,
        faltas: 2,
        avaliacoes: 0,
        faixa: { nome: "Cinza", graus: 2, imagem: "/Faixa - cinza.png" },
        perfil: {
            matricula: "17/03/2025",
            ultimaGraduacao: "18/10/2026",
            professor: "Professora C",
            programaAuxiliar: "—",
            idade: 9,
            nomeMae: "Simone",
            nomePai: null,
            escola: "Escola Exemplo",
            telefone: "(61) 96789-0123 · exemplo",
            endereco: "Rua Aurora, 90 - Norte - Cidade Exemplo",
            documentoAluno: "identidade-gabriela-exemplo.pdf",
            documentoResponsavel: "documento-responsavel-gabriela-exemplo.pdf"
        }
    },
    {
        id: 8,
        iniciais: "HD",
        nome: "Hugo",
        categoria: "Juvenil",
        turma: "Turma B",
        situacao: "Ativo",
        presenca: 75,
        faltas: 2,
        avaliacoes: 0,
        faixa: { nome: "Amarela", graus: 3, imagem: "/Faixa - amarela.png" },
        perfil: {
            matricula: "05/03/2021",
            ultimaGraduacao: "25/06/2026",
            professor: "Professor B",
            programaAuxiliar: "—",
            idade: 13,
            nomeMae: "Adriana",
            nomePai: "Paulo",
            escola: "E.M. Vila Nova",
            telefone: "(71) 97890-1234 · exemplo",
            endereco: "Praça da Matriz, 5 - Centro - Cidade Exemplo",
            documentoAluno: "identidade-hugo-exemplo.pdf",
            documentoResponsavel: "documento-responsavel-hugo-exemplo.pdf"
        }
    }
];

export function buscarAlunoPorId(id) {
    return alunos.find((aluno) => aluno.id === Number(id));
}

export default alunos;
