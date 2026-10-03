import { useLocation, useNavigate } from "react-router-dom";
import { LuArrowLeft, LuCheck, LuX } from "react-icons/lu";
import estilo from "../Dashboard_Formularios/Formulario.module.css";
import { PERMISSOES, podeAcessar, rotuloCargo } from "../../lib/permissoes";

// Exploração de permissões de um cargo. Não edita nada: mostra, área por
// área, o que aquele cargo consegue ou não acessar.
function PermissoesPerfil() {
  const navigate = useNavigate();
  const location = useLocation();
  const pessoa = location.state;

  const cargo = pessoa?.papel ?? "responsavel";

  const areas = Object.keys(PERMISSOES);

  const liberadas = areas.filter((area) => podeAcessar(cargo, area));

  if (!pessoa) {
    return (
      <main className={estilo.container}>
        <section className={estilo.section_main}>
          <div className={estilo.cartao}>
            <h2>Perfil não encontrado</h2>
            <p>Abra um perfil pela lista de equipe para ver as permissões.</p>

            <div className={estilo.acoes}>
              <button
                type="button"
                className={estilo.botao + " " + estilo.botao_principal}
                onClick={() => navigate("/Dashboard/equipe")}
              >
                Voltar à equipe
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={estilo.container}>
      <section className={estilo.section_main}>
        <div className={estilo.container_titulo}>
          <div>
            <strong>Equipe e acessos</strong>
            <h1>{pessoa.nome}</h1>
            <p>
              {rotuloCargo(cargo)} · {pessoa.email ?? "sem e-mail"}
            </p>
          </div>
        </div>

        <div className={estilo.cartao}>
          <h2>Permissões deste cargo</h2>
          <p>
            {liberadas.length} de {areas.length} áreas liberados. A mesma regra
            vale no menu e na URL: uma área bloqueada aqui não abre digitando
            o endereço.
          </p>

          <div className={estilo.lista_permissoes}>
            {areas.map((area) => {
              const liberada = podeAcessar(cargo, area);

              return (
                <div key={area} className={estilo.item_permissao}>
                  <span className={estilo.nome_area}>
                    {area.replace(/([A-Z])/g, " $1")}
                  </span>

                  <span className={estilo.cargos_area}>
                    {PERMISSOES[area].map((item) => rotuloCargo(item)).join(" · ")}
                  </span>

                  <span
                    className={
                      liberada
                        ? estilo.selo + " " + estilo.selo_liberado
                        : estilo.selo + " " + estilo.selo_bloqueado
                    }
                  >
                    {liberada ? <LuCheck size={14} /> : <LuX size={14} />}
                    {liberada ? "Liberado" : "Bloqueado"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className={estilo.acoes}>
            <button
              type="button"
              className={estilo.botao + " " + estilo.botao_secundario}
              onClick={() => navigate("/Dashboard/equipe")}
            >
              <LuArrowLeft size={16} />
              Voltar à equipe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PermissoesPerfil;
