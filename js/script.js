$(document).ready(function () {
    history.pushState("", "", "/");

    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmZWVnb3ciLCJhdWQiOiJwdWJsaWNhcGkiLCJpYXQiOiIxNy0wOC0yMDE4IiwibGljZW5zZUlEIjoiMTA1In0.UnUQPWYchqzASfDpVUVyQY0BBW50tSQQfVilVuvFG38";
    //Consultar Médicos Agendados
    if(document.querySelectorAll('.medico').length !== 0){
    $.ajax({
        url: "https://api.feegow.com.br/api/professional/list",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('x-access-token', token);
        },
        success: function (result) {
            for (let i = 0; i < document.querySelectorAll('.medico').length; i++) {
                for (let m = 0; m < result.content.length; m++) {
                    if(result.content[m].profissional_id == document.querySelectorAll('.medico')[i].getAttribute('name')){
                        document.querySelectorAll('.medico')[i].innerHTML = `Médico: ${result.content[m].nome}`
                    }
                }
            }
        }, error: function (error) {
            alert(error);
        }
    });
    }
    //Buscar Especialidades
    $.ajax({
        url: "https://api.feegow.com.br/api/specialties/list",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('x-access-token', token);
        },
        success: function (result) {
            for (let i = 0; i < result.content.length; i++) {
                $("#especialidades").append(`<option value="${result.content[i].especialidade_id}">${result.content[i].nome}</option>`)
            }
        }, error: function (error) {
            alert(error);
        }
    });

    $.ajax({
        url: "https://api.feegow.com.br/api/patient/list-sources",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('x-access-token', token);
        },
        success: function (result) {
            result.content.pop();
            for (let i = 0; i < result.content.length; i++) {
                $("#comoConheceu").append(`<option value="${result.content[i].origem_id}">${result.content[i].nome_origem}</option>`)
            }
        }, error: function (error) {
            alert(error);
        }
    });
    //Consulta dos medicos disponiveis para agendar
    $("#especialidades").on("change", function () {
        $(".result").remove();
        $.ajax({
            url: "https://api.feegow.com.br/api/professional/list",
            type: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('x-access-token', token);
            },
            success: function (result) {
                for (let i = 0; i < result.content.length; i++) {
                    let nome = result.content[i].nome
                    //Alguns dados estao com o sexo errado
                    if (result.content[i].sexo == 'Feminino') {
                        nome = "Dra. " + result.content[i].nome
                    } else {
                        nome = "Dr. " + result.content[i].nome
                    }
                    let crm = result.content[i].documento_conselho
                    if (crm === "") {
                        crm = "Sem CRM."
                    }
                    for (c = 0; c < result.content[i].especialidades.length; c++) {
                        if (result.content[i].especialidades[c].especialidade_id == $("#especialidades").val()) {
                            $(".agendados").append(`<div class="d-flex flex-row result"><div class="p-2 bd-highlight"><div style="background: #f1f1f1;width: 40px;height: 40px;" class="rounded-circle"></div></div><div class="p-2 bd-highlight">
                        ${nome} 
                        <br/> CRM: ${crm}<br/><button type="button" id="agendar" class="agendar" onclick="agendar(${result.content[i].profissional_id},${result.content[i].especialidades[c].especialidade_id})" data-toggle="modal" data-target="#abreModal">agendar</button></div></div>`);
                        }
                    }
                }
            }, error: function (error) {
                alert(error);
            }
        });
    })
    //Cria as mascaras do campo cpf
    const $campoCPF = document.querySelector('#cpf')
    $('#salvarHorarios').on("click", function (event) {
        $campoCPF.value = document.querySelector('#cpf').value.replace(/[.-]/g, "")
    })
    $campoCPF.addEventListener('focusin', (event) => {
        $valorDoCPF = event.target.value;
        $campoCPF.value = $valorDoCPF.replace(/[.-]/g, "")
        $campoCPF.maxLength = 11;
    })
    $campoCPF.addEventListener('focusout', () => {
        $valorDoCPF = event.target.value;
        $campoCPF.value = $valorDoCPF.replace(/(\d{3})?(\d{3})?(\d{3})?(\d{2})/, "$1.$2.$3-$4")
        $campoCPF.maxLength = 14;
    })

    //Janela de confirmação para casos de exclusão
    for (let i = 0; i < document.querySelectorAll('.deletar').length; i++) {
        document.querySelectorAll('.deletar')[i].addEventListener("click", function (event) {
            if (confirm("Deseja mesmo apagar?")) {
                return true;
            } else {
                event.preventDefault();
            }
        })
    }
    //Disparos de alerta para informar que tipo foi a manipulação dos dados
    if ($("#result").attr('name') == 'adicionado') {
        $(".alert-success").show();
        setTimeout(function () { $(".alert-success").hide(); }, 6000);
    } else if ($("#result").attr('name') == 'atualizado') {
        $(".alert-warning").show();
        setTimeout(function () { $(".alert-warning").hide(); }, 6000);
    } else if ($("#result").attr('name') == 'deletado') {
        $(".alert-danger").show();
        setTimeout(function () { $(".alert-danger").hide(); }, 6000);
    }
});

//Monta o formulario de agendamento
function agendar(profissional_id, especialidade_id) {
    $("#nome").val("");
    $("#cpf").val("");
    $("#nascimento").val("");
    $("#profissional_id").val(profissional_id);
    $("#specialty_id").val(especialidade_id);
    document.getElementById('comoConheceu').value = ""
    $("#form").attr("action", "salvar")
}

function montarAgendamento(name, source_id, cpf, datNascimento, agendarProfissional_id) {
    $("#nome").val(name);
    $("#cpf").val(cpf.replace(/(\d{3})?(\d{3})?(\d{3})?(\d{2})/, "$1.$2.$3-$4"));
    let data = new Date(datNascimento);
    let data2 = new Date(data.valueOf() - data.getTimezoneOffset() * 60000);
    const dataBase = data2.toISOString().replace(/\.\d{3}Z$/, '');
    $("#nascimento").val(dataBase.substring(0, 10))
    document.getElementById('comoConheceu').value = source_id
    $("#form").attr(`action`, `update/${agendarProfissional_id}`);
    $("#agendarProfissional_id").val(agendarProfissional_id)
}
