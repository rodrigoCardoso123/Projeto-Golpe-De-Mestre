// Dados de exemplo das turmas. Depois será substituído pelos dados da API.

const turmas = [
    {
        id: 1,
        programa: "Infantil",
        nome: "Turma A",
        descricao: "Coordenação, respeito e fundamentos.",
        professor: "Professor A",
        esporte: "Jiu-jitsu",
        horario: "Seg · Qua · Sex · 19:00-10:00",
        local: "Tatame 1",
        situacao: "Ativa",
        alunosAtivos: 6,
        capacidade: 12
    },
    {
        id: 2,
        programa: "Juvenil",
        nome: "Turma B",
        descricao: "Técnica, autodisciplina e cooperação.",
        professor: "Professor B",
        esporte: "Jiu-jitsu",
        horario: "Ter · Qui · 16:00-16:15",
        local: "Tatame 1",
        situacao: "Ativa",
        alunosAtivos: 5,
        capacidade: 14
    },
    {
        id: 3,
        programa: "Apoio educacional",
        nome: "Oficina de estudos",
        descricao: "Organização de rotina e rotina.",
        professor: "Professor A",
        esporte: "Oficina",
        horario: "Ter · Qui · 15:30-11:30",
        local: "Sala de estudos",
        situacao: "Ativa",
        alunosAtivos: 10,
        capacidade: 10
    }
];

export function buscarTurmaPorId(id) {
    return turmas.find((turma) => turma.id === Number(id));
}

export default turmas;
