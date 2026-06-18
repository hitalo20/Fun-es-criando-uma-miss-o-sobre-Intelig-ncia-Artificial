// ===== ELEMENTOS DO DOM =====
const tipoDado = document.getElementById('tipoDado');
const epocasSlider = document.getElementById('epocas');
const epocasDisplay = document.getElementById('epocasDisplay');
const taxaSlider = document.getElementById('taxa');
const taxaDisplay = document.getElementById('taxaDisplay');
const treinarBtn = document.getElementById('treinarBtn');
const graficoCanvas = document.getElementById('grafico');
const precisaoSpan = document.getElementById('precisao');
const erroSpan = document.getElementById('erro');
const funcaoAtivaSpan = document.getElementById('funcaoAtiva');
const previsaoTexto = document.getElementById('previsaoTexto');
const inputPrevisao = document.getElementById('inputPrevisao');
const preverBtn = document.getElementById('preverBtn');
const feedback = document.getElementById('feedback');
const progresso = document.getElementById('progresso');

// ===== VARIÁVEIS DO MODELO =====
let modelo = {
    peso: 0.5,
    bias: 0.1,
    treinado: false,
    dados: [],
    alvos: []
};

// ===== ATUALIZA DISPLAYS =====
epocasSlider.addEventListener('input', function() {
    epocasDisplay.textContent = this.value;
});

taxaSlider.addEventListener('input', function() {
    const valor = (this.value / 10).toFixed(1);
    taxaDisplay.textContent = valor;
});

// ===== GERAR DADOS DE TREINO =====
function gerarDados(tipo, n = 20) {
    const dados = [];
    const alvos = [];
    
    for (let i = 0; i < n; i++) {
        const x = (Math.random() * 4) - 2; // -2 a 2
        
        let y;
        switch(tipo) {
            case 'linear':
                y = 1.5 * x + 0.5 + (Math.random() * 0.3 - 0.15);
                break;
            case 'quadratico':
                y = 0.8 * x * x + 0.3 * x + 0.2 + (Math.random() * 0.3 - 0.15);
                break;
            case 'senoidal':
                y = Math.sin(x * 1.5) + (Math.random() * 0.2 - 0.1);
                break;
            default:
                y = x;
        }
        
        dados.push(x);
        alvos.push(y);
    }
    
    return { dados, alvos };
}

// ===== FUNÇÃO DE ATIVAÇÃO =====
function ativacao(x) {
    return Math.max(0, x); // ReLU
}

// ===== FUNÇÃO DE PREDIÇÃO =====
function predizer(x, peso, bias) {
    const soma = x * peso + bias;
    return ativacao(soma);
}

// ===== FUNÇÃO DE CUSTO (Erro Quadrático Médio) =====
function calcularCusto(dados, alvos, peso, bias) {
    let erroTotal = 0;
    for (let i = 0; i < dados.length; i++) {
        const pred = predizer(dados[i], peso, bias);
        const erro = pred - alvos[i];
        erroTotal += erro * erro;
    }
    return erroTotal / dados.length;
}

// ===== TREINAR MODELO =====
function treinarModelo() {
    const tipo = tipoDado.value;
    const epocas = parseInt(epocasSlider.value);
    const taxa = parseInt(taxaSlider.value) / 10;
    
    // Gerar dados
    const { dados, alvos } = gerarDados(tipo, 30);
    modelo.dados = dados;
    modelo.alvos = alvos;
    
    // Inicializar pesos
    let peso = (Math.random() * 2) - 1;
    let bias = (Math.random() * 0.5) - 0.25;
    
    // Treinamento
    let historicoErro = [];
    for (let epoca = 0; epoca < epocas; epoca++) {
        // Gradiente descendente simples
        let gradPeso = 0;
        let gradBias = 0;
        
        for (let i = 0; i < dados.length; i++) {
            const pred = predizer(dados[i], peso, bias);
            const erro = pred - alvos[i];
            
            // Derivada da ReLU (simplificada)
            const derivada = dados[i] > 0 ? 1 : 0;
            
            gradPeso += erro * dados[i] * derivada;
            gradBias += erro * derivada;
        }
        
        gradPeso /= dados.length;
        gradBias /= dados.length;
        
        // Atualizar pesos
        peso -= taxa * gradPeso;
        bias -= taxa * gradBias;
        
        // Registrar erro
        const erroAtual = calcularCusto(dados, alvos, peso, bias);
        historicoErro.push(erroAtual);
        
        // Atualizar progresso
        const progressoAtual = Math.round(((epoca + 1) / epocas) * 100);
        progresso.textContent = progressoAtual;
    }
    
    // Salvar modelo
    modelo.peso = peso;
    modelo.bias = bias;
    modelo.treinado = true;
    
    // Atualizar estatísticas
    const erroFinal = calcularCusto(dados, alvos, peso, bias);
    const precisao = Math.max(0, Math.min(100, 100 - (erroFinal * 20)));
    
    precisaoSpan.textContent = `${Math.round(precisao)}%`;
    erroSpan.textContent = erroFinal.toFixed(4);
    funcaoAtivaSpan.textContent = 'ReLU';
    
    // Desenhar gráfico
    desenharGrafico(dados, alvos, peso, bias);
    
    // Feedback
    feedback.textContent = `✅ Modelo treinado com sucesso! Erro: ${erroFinal.toFixed(4)}`;
    feedback.style.color = '#6ea8fe';
    
    // Previsão automática
    previsaoTexto.textContent = 'Modelo pronto para previsões!';
}

// ===== DESENHAR GRÁFICO =====
function desenharGrafico(dados, alvos, peso, bias) {
    const ctx = graficoCanvas.getContext('2d');
    const w = graficoCanvas.width;
    const h = graficoCanvas.height;
    const padding = 40;
    
    ctx.clearRect(0, 0, w, h);
    
    // Fundo
    ctx.fillStyle = 'rgba(10, 14, 26, 0.6)';
    ctx.fillRect(0, 0, w, h);
    
    // Encontrar limites
    let minX = Math.min(...dados);
    let maxX = Math.max(...dados);
    let minY = Math.min(...alvos);
    let maxY = Math.max(...alvos);
    
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    
    // Função para mapear coordenadas
    function mapX(x) {
        return padding + ((x - minX) / rangeX) * (w - 2 * padding);
    }
    
    function mapY(y) {
        return h - padding - ((y - minY) / rangeY) * (h - 2 * padding);
    }
    
    // Desenhar eixos
    ctx.strokeStyle = 'rgba(100, 150, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, h - padding);
    ctx.lineTo(w - padding, h - padding);
    ctx.stroke();
    
    // Desenhar pontos de dados
    ctx.fillStyle = '#6ea8fe';
    for (let i = 0; i < dados.length; i++) {
        const x = mapX(dados[i]);
        const y = mapY(alvos[i]);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Desenhar linha de predição
    if (modelo.treinado) {
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const steps = 50;
        for (let i = 0; i <= steps; i++) {
            const x = minX + (i / steps) * rangeX;
            const pred = predizer(x, peso, bias);
            const px = mapX(x);
            const py = mapY(pred);
            
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();
    }
    
    // Legendas
    ctx.fillStyle = '#8899bb';
    ctx.font = '11px Segoe UI, sans-serif';
    ctx.fillText('Dados reais', padding + 10, padding + 20);
    ctx.fillStyle = '#c084fc';
    ctx.fillText('Previsão', padding + 10, padding + 40);
}

// ===== FAZER PREVISÃO =====
function fazerPrevisao() {
    if (!modelo.treinado) {
        feedback.textContent = '⚠️ Treine o modelo primeiro!';
        feedback.style.color = '#fbbf24';
        return;
    }
    
    const x = parseFloat(inputPrevisao.value);
    if (isNaN(x)) {
        feedback.textContent = '⚠️ Digite um valor válido!';
        feedback.style.color = '#fbbf24';
        return;
    }
    
    const pred = predizer(x, modelo.peso, modelo.bias);
    previsaoTexto.textContent = `f(${x.toFixed(2)}) = ${pred.toFixed(4)}`;
    feedback.textContent = `🔮 Previsão realizada com sucesso!`;
    feedback.style.color = '#6ea8fe';
}

// ===== EVENTOS =====
treinarBtn.addEventListener('click', treinarModelo);
preverBtn.addEventListener('click', fazerPrevisao);

// ===== GERAR GRÁFICO INICIAL =====
function iniciar() {
    const { dados, alvos } = gerarDados('linear', 30);
    modelo.dados = dados;
    modelo.alvos = alvos;
    desenharGrafico(dados, alvos, 0.5, 0.1);
    feedback.textContent = '💡 Ajuste os parâmetros e clique em "Treinar Modelo"';
}

// ===== GERAR QUANDO MUDAR O TIPO =====
tipoDado.addEventListener('change', function() {
    const { dados, alvos } = gerarDados(this.value, 30);
    modelo.dados = dados;
    modelo.alvos = alvos;
    modelo.treinado = false;
    desenharGrafico(dados, alvos, 0.5, 0.1);
    precisaoSpan.textContent = '0%';
    erroSpan.textContent = '0.00';
    previsaoTexto.textContent = 'Aguardando treino...';
    progresso.textContent = '0';
    feedback.textContent = '📊 Dados atualizados! Clique em "Treinar Modelo"';
    feedback.style.color = '#8899bb';
});

// ===== INICIAR =====
window.addEventListener('load', iniciar);

// ===== REDIMENSIONAR GRÁFICO =====
window.addEventListener('resize', function() {
    if (modelo.treinado) {
        desenharGrafico(modelo.dados, modelo.alvos, modelo.peso, modelo.bias);
    } else {
        desenharGrafico(modelo.dados, modelo.alvos, 0.5, 0.1);
    }
});
