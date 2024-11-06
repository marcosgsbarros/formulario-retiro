$(document).ready(function() {
    let totalPriceValue = 760; // Variável global para armazenar o total
    let basePrice = 760; // Valor base inicial
    let acompanhanteCount = 0; // Contador de acompanhantes
    let totalPersons = 1; // Contador de pessoas (inclui o contratante principal)
    let freeAcompanhantes = 0; // Contador de acompanhantes com gratuidade

    $(document).ready(function() {
        let lastModalidade = 'individual'; // Armazena a última modalidade selecionada
    
        $('input[name="modalidade"]').change(function() {
            // Verifica se a nova modalidade é "individual" e há acompanhantes adicionados
            if ($(this).val() === 'individual' && $('.acompanhante').length > 0) {
                alert('Não é possível mudar para a modalidade individual enquanto houver acompanhantes adicionados. Por favor, remova todos os acompanhantes antes de mudar.');
                // Restaura a opção anterior
                $(this).prop('checked', false);
                $(`input[name="modalidade"][value="${lastModalidade}"]`).prop('checked', true);
                return; // Sai da função para evitar a mudança
            }
    
            // Atualiza a última modalidade selecionada
            lastModalidade = $(this).val();
    
            if ($(this).val() === 'coletiva') {
                $('#addAcompanhante').show();
            } else {
                $('#addAcompanhante').hide();
                $('.acompanhantes-container').empty();
                acompanhanteCount = 0;
            }
        });
    }); 

    function updatePrice() {
        // Calcula o total com base no número de pessoas pagantes
        totalPriceValue = basePrice * (totalPersons + acompanhanteCount - freeAcompanhantes);

        // Verifica se o quarto exclusivo está marcado
        if ($('#quartoExclusivo').is(':checked')) {
            totalPriceValue = basePrice * 4; // Quarto exclusivo = 4 registros
            total = totalPersons + acompanhanteCount - freeAcompanhantes
            if (total > 4){
                totalPriceValue += basePrice;
            }
        }
         // Garante que o valor total não seja menor que o valor base
        if (totalPriceValue < basePrice) {
            totalPriceValue = basePrice; // Define o valor mínimo como o valor base
        }

        // Atualiza o DOM com o valor total e o número de pessoas
        $('#totalPrice').text(totalPriceValue.toFixed(2));
        $('#pessoasCount').text(totalPersons + acompanhanteCount);

        return totalPriceValue;
    }

    // Chamada da função ao perder o foco do campo
    $('#nome').on('blur', function() {
        validarNomeCompleto($(this));
    });
     // Adiciona eventos de validação aos campos de telefone, CPF e data de nascimento
     $('#telefone').on('blur', function() {
        validarTelefone($(this));
    });

    $('#cpf').on('blur', function() {
        validarCPF($(this));
    });

    $('#nascimento').on('blur', function() {
        validarNascimento($(this));
    });

    // Evento de mudança que chama a atualização de preço
    $('#quartoExclusivo').change(function() {
        updatePrice();
    });

    $('#compartilharQuarto').change(function() {
        if($(this).is(':checked')) {
            $('#sugestaoQuartoDiv').show();
        } else {
            $('#sugestaoQuartoDiv').hide();
            $('#sugestaoCasal').val('');
        }
    });

    $('#quartoExclusivo, #compartilharQuarto').change(function() {
        if($(this).is(':checked')) {
            const otherId = $(this).attr('id') === 'quartoExclusivo' ? 
                '#compartilharQuarto' : '#quartoExclusivo';
            $(otherId).prop('checked', false);
            if(otherId === '#compartilharQuarto') {
                $('#sugestaoQuartoDiv').hide();
                $('#sugestaoCasal').val('');
            }
        }
    });

        $('#understood').change(function() {
            if($(this).is(':checked')) {
                $('#whatsappButton').hide();
            }
        });

        $('#needHelp').change(function() {
            if($(this).is(':checked')) {
                $('#whatsappButton').show();
            }
        });

        // Make acknowledgment options exclusive
        $('#understood, #needHelp').change(function() {
            if($(this).is(':checked')) {
                const otherId = $(this).attr('id') === 'understood' ? '#needHelp' : '#understood';
                $(otherId).prop('checked', false);
            }
        });
    // Aplica as máscaras aos campos
    $('#telefone').mask('(00) 00000-0000');
    $('#cpf').mask('000.000.000-00');
    $('#nascimento').mask('00/00/0000');

// Função para validar nome completo
function validarNomeCompleto(campo) {
    const nome = campo.val().trim();
    if (nome === '') {
        return true; // Não faz a validação se o campo estiver vazio
    }

    // Verifica se contém apenas letras e pelo menos duas palavras
    const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s[A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;
    if (!nomeRegex.test(nome)) {
        alert('Nome inválido! Por favor, insira um nome completo contendo apenas letras.');
        setTimeout(() => {
            campo.focus(); // Retorna o foco ao campo para correção
        }, 0);
        return false;
    }
    return true;
}

// Função para validar telefone
function validarTelefone(campo) {
    const telefone = campo.val().trim();
    if (telefone === '') {
        return true; // Não faz a validação se o campo estiver vazio
    }

    const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    if (!telefoneRegex.test(telefone)) {
        alert('Telefone inválido! Por favor, insira no formato (00) 00000-0000.');
        setTimeout(() => {
            campo.focus(); // Retorna o foco ao campo para correção
        }, 0);
        return false;
    }
    return true;
}

// Função para validar CPF
function validarCPF(campo) {
    const cpf = campo.val().trim();
    if (cpf === '') {
        return true; // Não faz a validação se o campo estiver vazio
    }

    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(cpf)) {
        alert('CPF inválido! Por favor, insira no formato 000.000.000-00.');
        setTimeout(() => {
            campo.focus(); // Retorna o foco ao campo para correção
        }, 0);
        return false;
    }
    return true;
}

// Função para validar data de nascimento
function validarNascimento(campo) {
    const nascimento = campo.val().trim();
    if (nascimento === '') {
        return true; // Não faz a validação se o campo estiver vazio
    }

    const nascimentoRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!nascimentoRegex.test(nascimento)) {
        alert('Data de nascimento inválida! Por favor, insira no formato DD/MM/AAAA.');
        setTimeout(() => {
            campo.focus(); // Retorna o foco ao campo para correção
        }, 0);
        return false;
    }

    // Verifica se a data é válida no calendário
    const dataNascimento = moment(nascimento, 'DD/MM/YYYY', true);
    if (!dataNascimento.isValid()) {
        alert('Data de nascimento inválida! Por favor, insira uma data que exista no calendário.');
        setTimeout(() => {
            campo.focus(); // Retorna o foco ao campo para correção
        }, 0);
        return false;
    }

    // Verifica se a data não é anterior a 1925
    if (dataNascimento.year() < 1925) {
        alert('Data de nascimento inválida! Não é permitido datas anteriores a 1925.');
        setTimeout(() => {
            campo.focus(); // Retorna o foco ao campo para correção
        }, 0);
        return false;
    }

    // Verifica se a data não é maior que hoje
    const dataAtual = moment();
    if (dataNascimento.isAfter(dataAtual)) {
        alert('Data de nascimento inválida! Não é permitido datas futuras.');
        setTimeout(() => {
            campo.focus(); // Retorna o foco ao campo para correção
        }, 0);
        return false;
    }

    return true;
}


    function createAcompanhanteHTML(index) {
        return `
            <div class="acompanhante" id="acompanhante${index}">
                <h3>Dados do Acompanhante ${index + 1}</h3>
                <h5>Obs: Todos os membros da família devem ser cadastrados, inclusive as crianças menores de 6 anos.</h5>
                <div class="form-group">
                    <label>Nome Completo*</label>
                    <input type="text" class="nome-acompanhante" required>
                </div>
                <div class="form-group">
                    <label>Data de Nascimento*</label>
                    <input type="text" class="nascimento-acompanhante" required>
                </div>
                <div class="form-group">
                    <label>RG</label>
                    <input type="text" class="rg-acompanhante">
                </div>
                <div class="form-group">
                    <label>CPF*</label>
                    <input type="text" class="cpf-acompanhante" required>
                </div>
                <div class="form-group">
                    <label>Grau de Parentesco*</label>
                    <input type="text" class="parentesco" required>
                </div>
                <div class="remover-acompanhante">
                    <button type="button" class="remover-btn">Remover</button>
                </div>
            </div>
        `;
    }

    $('#addAcompanhante').click(function() {

         // Verifica se todos os campos obrigatórios dos acompanhantes existentes estão preenchidos
        let todosPreenchidos = true;
        $('.acompanhante').each(function() {
            $(this).find('input[required]').each(function() {
                if ($(this).val().trim() === '') {
                    todosPreenchidos = false;
                    return false; // Interrompe o loop interno
                }
            });
            if (!todosPreenchidos) {
                return false; // Interrompe o loop externo
            }
        });

        if (!todosPreenchidos) {
            alert('Por favor, preencha todos os campos obrigatórios dos acompanhantes antes de adicionar um novo.');
            return; // Interrompe a execução da função
        }

        if (acompanhanteCount >= 4) {
            alert('O número máximo de 4 acompanhantes foi atingido. Não é possível adicionar mais.');
            return; // Interrompe a execução da função
        }
        const newAcompanhante = createAcompanhanteHTML(acompanhanteCount);
        $('.acompanhantes-container').append(newAcompanhante);
        
        // Aplica máscaras aos novos campos
        $(`#acompanhante${acompanhanteCount} .telefone-acompanhante`).mask('(00) 00000-0000');
        $(`#acompanhante${acompanhanteCount} .cpf-acompanhante`).mask('000.000.000-00');
        $(`#acompanhante${acompanhanteCount} .nascimento-acompanhante`).mask('00/00/0000');

        $(document).on('blur', '.cpf-acompanhante', function() {
            if (!validarCPF($(this))) {
                return; // Sai da função se a validação falhar
            }
        });
        // Valida o nome dos acompanhantes
        $(document).on('blur', '.nome-acompanhante', function() {
            if (!validarNomeCompleto($(this))) {
                return; // Sai da função se a validação falhar
            }
        });     
    
        // Adiciona evento de mudança para verificar a idade e atualizar o preço
        $(`#acompanhante${acompanhanteCount} .nascimento-acompanhante`).on('blur', function() {
            verificarIdadeParaAtualizacaoDePreco($(this));
        });
        acompanhanteCount++;
        console.log(`Acompanhantes adicionados: ${acompanhanteCount}`);
        updatePrice();

    });
    
    function verificarIdadeParaAtualizacaoDePreco($input) {
        const dataNascimentoStr = $input.val().trim();

        if (!validarNascimento($input)) {
            return; // Sai da função se a validação falhar
        }
    
        // Verifica se a data foi inserida e se é válida
        if (dataNascimentoStr && moment(dataNascimentoStr, 'DD/MM/YYYY', true).isValid()) {
            const dataNascimento = moment(dataNascimentoStr, 'DD/MM/YYYY');
            const dataLimite = moment('10/04/2025', 'DD/MM/YYYY');
            const idade = dataLimite.diff(dataNascimento, 'years');
    
            console.log(`Verificando idade: ${idade} anos`);
    
            if (idade < 6) {
                // Verifica se o acompanhante não foi previamente marcado como gratuito
                if (!$input.data('isFree')) {
                    freeAcompanhantes++;
                    $input.data('isFree', true); // Marca o input como gratuito
                    console.log(`Idade menor que 6 anos. Incrementando a contagem de acompanhantes gratuitos: ${freeAcompanhantes}`);
    
                    // Subtrai o basePrice do total
                    let currentTotal = updatePrice();
                    totalPriceValue = currentTotal - basePrice;
    
                    // Verifica se o total resultante é menor que o basePrice
                    if (totalPriceValue < basePrice) {
                        totalPriceValue = basePrice; // Define o valor mínimo como basePrice
                    }
    
                    updatePrice();
                    console.log(`TotalPriceValue atualizado após subtração: ${totalPriceValue}`);
                }
            } else {
                // Verifica se o acompanhante estava previamente marcado como gratuito
                if ($input.data('isFree')) {
                    freeAcompanhantes--;
                    $input.removeData('isFree'); // Remove a marcação de gratuidade
                    console.log(`Idade igual ou maior que 6 anos. Reduzindo a contagem de acompanhantes gratuitos: ${freeAcompanhantes}`);
    
                    // Adiciona o basePrice de volta ao total
                    let currentTotal = updatePrice();
                    totalPriceValue = currentTotal + basePrice;
    
                    updatePrice();
                    console.log(`TotalPriceValue atualizado após adição: ${totalPriceValue}`);
                }
            }
            const installmentSelects = document.querySelectorAll('.installment-select');
            installmentSelects.forEach(select => {
                updateInstallmentOptions(select, totalPriceValue);
            });
        }
    }    
    
    
    $(document).on('click', '.remover-acompanhante', function() {
        const $acompanhante = $(this).closest('.acompanhante');
        const $inputNascimento = $acompanhante.find('.nascimento-acompanhante');
    
        // Verifica se o acompanhante removido era gratuito
        if ($inputNascimento.data('isFree')) {
            freeAcompanhantes--;
            console.log(`Acompanhante gratuito removido. Reduzindo contagem de acompanhantes gratuitos: ${freeAcompanhantes}`);
        }
    
        $acompanhante.remove();
        acompanhanteCount--;
        updatePrice(); // Atualiza o preço ao remover um acompanhante

    });
    
    
    $('#inscricaoForm').submit(function(e) {
        e.preventDefault(); // Impede o envio padrão do formulário

        updatePrice();
    
        // Validações de modalidade
        if ($('input[name="modalidade"]:checked').val() === 'individual') {
            if ($('.acompanhante').length > 0) {
                alert('Na modalidade individual não é permitido adicionar acompanhantes.');
                return;
            }
        } else {
            if ($('.acompanhante').length === 0) {
                alert('Na modalidade coletiva é necessário adicionar pelo menos um acompanhante.');
                return;
            }
        }

        // Verifica se o elemento existe e se a opção está marcada
        var section = document.querySelector('.acknowledgment-section');
        var checkboxChecked = $('#understood').is(':checked');

        if (section && !checkboxChecked) {
            section.scrollIntoView({ behavior: 'smooth', block: 'center' });
            alert('Você precisa aceitar os termos acima e marcar a opção "Li e estou de acordo com as informações na parte superior da página" para continuar.');
            return;
        }
    
      // Coleta o nome do formulário principal
    const nomePrincipal = $('#nome').val().trim(); // Lembre-se de garantir que o nome seja único ou tratado corretamente

    const dadosFormulario = {
        nomeReferencia: nomePrincipal, // Usa o nome do usuário principal como referência
        principal: {
            nome: nomePrincipal, // Nome do usuário principal
            telefone: $('#telefone').val(),
            email: $('#email').val(),
            cpf: $('#cpf').val(),
            estadoCivil: $('#estadoCivil').val(),
            dataNascimento: $('#nascimento').val(),
            sexo: $('input[name="sexo"]:checked').val(),
            endereco: $('#endereco').val(),
            modalidade: $('input[name="modalidade"]:checked').val(),
            quartoExclusivo: $('#quartoExclusivo').is(':checked'),
            sugestaoCasal: $('#sugestaoCasal').val()
        },
        acompanhantes: [], // Lista de acompanhantes com a referência de nome
        totalPessoas: totalPersons + acompanhanteCount,
        numeroDeAcompanhantes: acompanhanteCount,
        acompanhantesAbaixoDe6Anos: freeAcompanhantes,
        valorTotal: totalPriceValue.toFixed(2)
    };

    // Coleta os dados de cada acompanhante e inclui o nome de referência
    $('.acompanhante').each(function() {
        dadosFormulario.acompanhantes.push({
            nomeReferencia: nomePrincipal, // Nome de referência do usuário principal
            nome: $(this).find('.nome-acompanhante').val(),
            nascimento: $(this).find('.nascimento-acompanhante').val(),
            cpf: $(this).find('.cpf-acompanhante').val(),
            parentesco: $(this).find('.parentesco').val(),
        });
    });

    // Salva no localStorage e exibe no console
    localStorage.setItem('dadosFormulario', JSON.stringify(dadosFormulario));
    console.log(dadosFormulario);
    //Enviar uma requisição POST para o servidor com os dados do formulário
    //url https://hooks.zapier.com/hooks/catch/20646902/251vjp1/
    fetch('https://hooks.zapier.com/hooks/catch/20646902/251vjp1/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosFormulario)
    }).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Erro ao enviar dados do formulário');
    }
    ).then(data => {
        console.log(data);

        

        // Redireciona para a próxima página
        window.location.href = 'pagamento.html';
    });
    });
});
