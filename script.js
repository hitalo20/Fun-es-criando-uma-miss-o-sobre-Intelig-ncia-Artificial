let tarefasConcluidas = 0;

function verificarTarefa1() {
    const resposta = document.getElementById('resposta1').value.trim().toLowerCase();
    const feedback = document.getElementById('feedback1');
    
    if (resposta.length === 0) {
        feedback.textContent = 'Por favor, digite uma resposta!';
        feedback.style.color = '#e74c3c';
        return;
    }
    
    // Palavras-chave para considerar a resposta válida
    const palavrasChave = ['inteligência', 'máquina', 'aprender', 'raciocínio', 'cérebro', 'computador', 'robô', 'algoritmo', 'dados'];
    const respostaValida = palavrasChave.some(palavra => resposta.includes(palavra));
    
    if (respostaValida) {
        feedback.textContent = '✅ Excelente! Você compreende o conceito de IA!';
        feedback.style.color = '#27ae60';
        concluirTarefa('tarefa1');
    } else {
        feedback.textContent = '❌ Tente incluir palavras como: inteligência, máquina, aprender, raciocínio...';
        feedback.style.color = '#e74c3c';
    }
}

function verificarTarefa2() {
    const resposta = document.getElementById('resposta2').value.trim().toLowerCase();
    const feedback = document.getElementById('feedback2');
    
    // Exemplos de IA (incluindo algumas variações)
    const exemplosIA = ['alexa', 'siri', 'netflix', 'youtube', 'spotify', 'google', 'assistente', 'chatgpt', 'cortana', 'tesla', 'reconhecimento', 'mapas', 'waze', 'uber'];
    
    const palavras = resposta.split(/[,\s]+/);
    const encontrados = palavras.filter(palavra => 
        exemplosIA.some(exemplo => palavra.includes(exemplo))
    );
    
    if (encontrados.length >= 2) {
        feedback.textContent = `✅ Ótimo! Você citou exemplos de IA como: ${encontrados.slice(0, 3).join(', ')}`;
        feedback.style.color = '#27ae60';
        concluirTarefa('tarefa2');
    } else {
        feedback.textContent = '❌ Cite pelo menos 2 exemplos de IA. Exemplos: Alexa, Siri, Netflix, ChatGPT...';
        feedback.style.color = '#e74c3c';
    }
}

function criarRobo() {
    const container = document.getElementById('roboContainer');
    const roboExistente = container.querySelector('.robo');
    
    if (roboExistente) {
        container.removeChild(roboExistente);
    }
    
    const robo = document.createElement('div');
    robo.className = 'robo';
    
    // Array com diferentes expressões de robô
    const expressoes = ['🤖', '👾', '🦾', '⚡', '🧠', '💻'];
    const expressao = expressoes[Math.floor(Math.random() * expressoes.length)];
    
    robo.textContent = expressao;
    container.appendChild(robo);
    
    // Adicionar mensagem criativa
    setTimeout(() => {
        const mensagens = [
            '🤖 Olá, humano!',
            '⚡ Robô ativado!',
            '🧠 Processando informações...',
            '🦾 Sistema operacional!',
            '👾 Nova IA criada!',
            '💻 Inteligência artificial!'
        ];
        const mensagem = mensagens[Math.floor(Math.random() * mensagens.length)];
        
        const mensagemElement = document.createElement('p');
        mensagemElement.textContent = mensagem;
        mensagemElement.style.marginTop = '10px';
        mensagemElement.style.color = '#2c3e50';
        mensagemElement.style.fontWeight = 'bold';
        
        // Remover mensagem anterior se existir
        const mensagemAntiga = container.querySelector('p');
        if (mensagemAntiga) {
            container.removeChild(mensagemAntiga);
        }
        
        container.appendChild(mensagemElement);
    }, 500);
    
    concluirTarefa('tarefa3');
}

function concluirTarefa(tarefaId) {
    const tarefa = document.getElementById(tarefaId);
    
    // Verificar se a tarefa já foi concluída
    if (tarefa.classList.contains('concluida')) {
        return;
    }
    
    tarefa.classList.add('concluida');
    tarefasConcluidas++;
    atualizarProgresso();
}

function atualizarProgresso() {
    const barra = document.getElementById('barra');
    const status = document.getElementById('status');
    
    const percentual = (tarefasConcluidas / 3) * 100;
    barra.style.width = percentual + '%';
    
    status.textContent = `Tarefas completadas: ${tarefasConcluidas}/3`;
    
    // Verificar se todas as tarefas foram concluídas
    if (tarefasConcluidas === 3) {
        status.textContent = '🎉 PARABÉNS! Você completou todas as tarefas! Você é um Mestre da IA! 🎉';
        status.style.color = '#27ae60';
        status.style.fontSize = '1.2em';
    } else {
        status.style.color = '#34495e';
        status.style.fontSize = '1em';
    }
}

// Adicionar efeito de "Enter" para as tarefas
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('resposta1').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            verificarTarefa1();
        }
    });
    
    document.getElementById('resposta2').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            verificarTarefa2();
        }
    });
});

// Criar um robô automaticamente quando a página carregar
window.onload = function() {
    criarRobo();
};
