/* ==========================================================================
   js/mapas/fase05.js - Fase 05: Depósito Ultragaz (Botijões, 5 Min e Tanker)
   ========================================================================== */

const MapaFase05 = {
    botijoesComuns: 0,
    botijaoMaior: false,
    botijaoEspecial: false,
    defesaIniciada: false,
    defesaConcluida: false,
    timerDefesa: 300, // 5 minutos (300 segundos)
    intervaloDefesa: null,
    portaSubterraneoMesh: null,

    construir(cena) {
        this.limparTimers();
        this.botijoesComuns = 0;
        this.botijaoMaior = false;
        this.botijaoEspecial = false;
        this.defesaIniciada = false;
        this.defesaConcluida = false;
        this.timerDefesa = 300;

        cena.background = new THREE.Color(0x161d26);
        cena.fog = new THREE.FogExp2(0x161d26, 0.014);

        // Chão do pátio e galpão da Ultragaz
        const chao = new THREE.Mesh(
            new THREE.PlaneGeometry(80, 110),
            new THREE.MeshLambertMaterial({ color: 0x343a40 })
        );
        chao.rotation.x = -Math.PI / 2;
        cena.add(chao);

        // Paredes do Galpão Principal (Interior da Ultragaz: z = -10 até z = -45)
        const matGalpao = new THREE.MeshLambertMaterial({ color: 0x1f618d });
        const paredeEsq = new THREE.Mesh(new THREE.BoxGeometry(0.6, 6, 36), matGalpao);
        paredeEsq.position.set(-16, 3, -28);
        cena.add(paredeEsq);

        const paredeDir = new THREE.Mesh(new THREE.BoxGeometry(0.6, 6, 36), matGalpao);
        paredeDir.position.set(16, 3, -28);
        cena.add(paredeDir);

        // Porta de aço blindada bloqueando o Subterrâneo (z = -46)
        this.portaSubterraneoMesh = new THREE.Mesh(
            new THREE.BoxGeometry(10, 4.5, 0.8),
            new THREE.MeshLambertMaterial({ color: 0x922b21 })
        );
        this.portaSubterraneoMesh.position.set(0, 2.25, -46);
        cena.add(this.portaSubterraneoMesh);

        // Sala do Subterrâneo / Porão Blindado (z = -47 até z = -72)
        const paredeFundoPorao = new THREE.Mesh(
            new THREE.BoxGeometry(32, 6, 0.8),
            new THREE.MeshLambertMaterial({ color: 0x212529 })
        );
        paredeFundoPorao.position.set(0, 3, -72);
        cena.add(paredeFundoPorao);

        // Suprimentos de combate
        if (typeof Itens !== "undefined") {
            Itens.spawnarPickup(cena, "municao", -10, -16);
            Itens.spawnarPickup(cena, "municao", 10, -16);
            Itens.spawnarPickup(cena, "kit_medico", 0, -24);
            Itens.spawnarPickup(cena, "municao", -8, -55);
        }

        // 1. Pátio de Entrada: 3 Botijões Comuns (P13)
        const posComuns = [
            { x: -9, z: 6 },
            { x: 10, z: 2 },
            { x: -6, z: -4 }
        ];

        if (typeof Puzzles !== "undefined") {
            posComuns.forEach((pos, idx) => {
                Puzzles.criarItemMissao(
                    cena,
                    "botijao_comum",
                    pos.x,
                    0,
                    pos.z,
                    `Botijão Comum (${idx + 1}/3)`,
                    () => {
                        this.botijoesComuns++;
                        this.atualizarHudMissao();
                    }
                );
            });

            // 2. Interior da Loja: Botijão Maior (P45) -> Dispara horda de 5 minutos!
            Puzzles.criarItemMissao(
                cena,
                "botijao_maior",
                0,
                0,
                -30,
                "Botijão Maior (P45) — Dispara Alarme!",
                () => {
                    this.botijaoMaior = true;
                    this.iniciarDefesa5Minutos(cena);
                }
            );

            // 3. Subterrâneo: Botijão Especial + Mini-Boss Tanker (estilo Left 4 Dead)
            Puzzles.criarItemMissao(
                cena,
                "botijao_especial",
                0,
                0,
                -66,
                "Botijão Especial de Alta Pressão",
                () => {
                    this.botijaoEspecial = true;
                    this.verificarConclusaoUltragaz(cena);
                }
            );
        }

        // Horda inicial no pátio + Mini-Boss Tanker aguardando no subterrâneo
        if (typeof Zumbis !== "undefined") {
            Zumbis.gerarHorda(14, { minX: -14, maxX: 14, minZ: -38, maxZ: 10 });
            Zumbis.spawnar("tanker", 0, 0, -60);
        }

        this.atualizarHudMissao();
    },

    iniciarDefesa5Minutos(cena) {
        if (this.defesaIniciada) return;
        this.defesaIniciada = true;
        alert("🚨 ALARME DISPARADO! Sobreviva à horda por 5 MINUTOS para destravar a porta do subterrâneo!");

        this.intervaloDefesa = setInterval(() => {
            if (typeof MotorJogo === "undefined" || MotorJogo.pausado || !MotorJogo.emExecucao) return;
            if (GameConfig.faseAtual !== 5) {
                this.limparTimers();
                return;
            }

            this.timerDefesa--;
            this.atualizarHudMissao();

            // Spawna reforços da horda a cada 30 segundos durante a defesa
            if (this.timerDefesa % 30 === 0 && this.timerDefesa > 0 && typeof Zumbis !== "undefined") {
                Zumbis.gerarHorda(10, { minX: -14, maxX: 14, minZ: -12, maxZ: 12 });
            }

            if (this.timerDefesa <= 0) {
                this.limparTimers();
                this.defesaConcluida = true;
                if (this.portaSubterraneoMesh) {
                    cena.remove(this.portaSubterraneoMesh);
                }
                alert("🔓 PORTA DO SUBTERRÂNEO DESTRAVADA! Cuidado: o Tanker está lá embaixo!");
                this.atualizarHudMissao();
            }
        }, 1000);
    },

    verificarConclusaoUltragaz(cena) {
        if (this.botijoesComuns >= 3 && this.botijaoMaior && this.botijaoEspecial) {
            alert("⛽ TODOS OS BOTIJÕES COLETADOS! Saia pela entrada da Ultragaz para voltar ao Jardim Novo Mundo!");
            if (typeof Puzzles !== "undefined") {
                Puzzles.criarPortalRota(cena, 2, 0, 0, 14, "Voltar ao Jardim Novo Mundo (Fase 02)");
            }
            if (typeof SistemaProgresso !== "undefined") {
                SistemaProgresso.concluirFase(5);
            }
        } else {
            alert("⚠️ Você ainda precisa pegar todos os 3 Botijões Comuns no pátio antes de sair!");
        }
        this.atualizarHudMissao();
    },

    atualizarHudMissao() {
        const elObj = document.getElementById("hud-objetivo");
        if (!elObj) return;

        let texto = `⛽ Ultragaz — Comuns: ${this.botijoesComuns}/3 | Maior: ${this.botijaoMaior ? "✅" : "❌"} | Especial: ${this.botijaoEspecial ? "✅" : "❌"}`;
        if (this.defesaIniciada && !this.defesaConcluida) {
            const min = String(Math.floor(this.timerDefesa / 60)).padStart(2, "0");
            const seg = String(this.timerDefesa % 60).padStart(2, "0");
            texto += ` | ⏳ Defesa: ${min}:${seg}`;
        }
        elObj.textContent = texto;
    },

    limparTimers() {
        if (this.intervaloDefesa) {
            clearInterval(this.intervaloDefesa);
            this.intervaloDefesa = null;
        }
    }
};