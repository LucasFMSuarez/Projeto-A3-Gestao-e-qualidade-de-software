const API_LEMBRETES = "http://localhost:4000";
const API_OBSERVACOES = "http://localhost:5000";

const lista = document.getElementById("listaLembretes");
const form = document.getElementById("formLembrete");
const input = document.getElementById("novoLembrete");
const btnImportanteLembrete = document.getElementById("btnImportanteLembrete");

let lembreteImportante = false;

// alterna o visual do importante
btnImportanteLembrete.addEventListener("click", () => {
  lembreteImportante = !lembreteImportante;
  btnImportanteLembrete.classList.toggle("active", lembreteImportante);
});

async function carregarLembretes() {
  lista.innerHTML = "";

  try {
    const res = await fetch(`${API_LEMBRETES}/lembretes`);
    const lembretes = await res.json();

    for (const lembrete of lembretes) {
      const li = document.createElement("li");

      const titulo = document.createElement("strong");
      titulo.textContent = lembrete.texto;
      li.appendChild(titulo);

      if (lembrete.status === "importante") {
        const tag = document.createElement("span");
        tag.textContent = "IMPORTANTE";
        tag.classList.add("tag");
        li.appendChild(tag);
      }

      const btnDel = document.createElement("button");
      btnDel.textContent = "Excluir";
      btnDel.classList.add("delete");
      btnDel.addEventListener("click", async () => {
        await fetch(`${API_LEMBRETES}/lembretes/${lembrete.id}`, { method: "DELETE" });
        carregarLembretes();
      });
      li.appendChild(btnDel);

      const obsDiv = document.createElement("div");
      obsDiv.classList.add("observacoes");

      const obsRes = await fetch(`${API_OBSERVACOES}/lembretes/${lembrete.id}/observacoes`);
      const observacoes = await obsRes.json();

      observacoes.forEach(obs => {
        const p = document.createElement("p");

        const spanTxt = document.createElement("span");
        spanTxt.textContent = obs.texto;
        p.appendChild(spanTxt);

        if (obs.status === "importante") {
          const tag = document.createElement("span");
          tag.textContent = "IMPORTANTE";
          tag.classList.add("tag");
          p.appendChild(tag);
        }

        const btnDelObs = document.createElement("button");
        btnDelObs.textContent = "Excluir";
        btnDelObs.classList.add("delete");
        btnDelObs.addEventListener("click", async () => {
          await fetch(`${API_OBSERVACOES}/observacoes/${obs.id}`, { method: "DELETE" });
          carregarLembretes();
        });
        p.appendChild(btnDelObs);

        obsDiv.appendChild(p);
      });

      // Form de nova observação
      const formObs = document.createElement("form");
      formObs.style.display = "flex";
      formObs.style.gap = "8px";

      formObs.innerHTML = `
        <input type="text" placeholder="Nova observação" required />
        <button type="button" class="btnObsImportant important">Importante</button>
        <button type="submit" class="addObs">Adicionar</button>
      `;

      let obsImportante = false;
      const btnObsImportant = formObs.querySelector(".btnObsImportant");

      btnObsImportant.addEventListener("click", () => {
        obsImportante = !obsImportante;
        btnObsImportant.classList.toggle("active", obsImportante);
      });

      formObs.addEventListener("submit", async (e) => {
        e.preventDefault();

        const textoObs = formObs.querySelector("input").value.trim();
        if (!textoObs) return;

        await fetch(`${API_OBSERVACOES}/lembretes/${lembrete.id}/observacoes`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            texto: textoObs,
            status: obsImportante ? "importante" : "comum"
          })
        });

        carregarLembretes();
      });

      obsDiv.appendChild(formObs);
      li.appendChild(obsDiv);
      lista.appendChild(li);
    }
  } catch (err) {
    console.error("Erro:", err);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const texto = input.value.trim();
  if (!texto) return;

  await fetch(`${API_LEMBRETES}/lembretes`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      texto,
      status: lembreteImportante ? "importante" : "comum"
    })
  });

  input.value = "";
  lembreteImportante = false;
  btnImportanteLembrete.classList.remove("active");

  carregarLembretes();
});

carregarLembretes();
