## Introdução do problema
A clínica Exemplo precisa exibir a listagem de seus médicos separados por especialidade em seu site para que seus pacientes tenham acesso. Essa clínica utiliza o Feegow que possui toda a api necessária para isso, disponibilizada pela empresa.

## Solução
Foi criado uma solução totalmente alimentada pela API disponibilizada, onde suas operações é no formato de CRUD (Create, Read, Update and Delete).

## Instalação

### Banco
```
CREATE DATABSE feegow;

CREATE TABLE `agendarprofissional` (
  `agendarProfissional_id` int(11) NOT NULL primary key auto_increment,
  `specialty_id` int(11) DEFAULT NULL,
  `profissional_id` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `cpf` varchar(11) DEFAULT NULL,
  `source_id` int(11) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `date_time` datetime DEFAULT NULL
);

```
### Codigo
```
npm install
```

## Tecnologias Utilizadas 

* Boostrap
* Jquery
* Ajax
* NodeJs
* Banco MySql
