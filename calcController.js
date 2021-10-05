class CalcController {
    //Construtor do objeto
    constructor() {
        // _ define por convenção que o atributo é privado
        this._audio = new Audio('click.mp3'); //Instanciando um variável do tipo audio 
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = []; //Expressão que será mostrada na calculadora
        this._locale = 'pt-BR';
        this._localeOptions = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' }; //Config do TolocaleData
        this._localeOptionsTime = { hour12: false }; //Config do ToLocaleTime
        this._displayCalcEL = document.querySelector("#display"); //Valor do display
        this._timeCalcEL = document.querySelector("#hora"); //Valor de hora
        this._dateCalcEl = document.querySelector("#data"); //Valor de data
        this.initialize(); //Inicializa o tempo
        this.initButtonsEvents(); //Inicializa os eventos
        this.initiBeyBoard();//Inicializa a função que inicializa eventos do teclado
    }
    //Getters e Setters 
    get displayTime() {

        return this._timeCalcEL.innerHTML;
    }

    set displayTime(value) {

        this._timeCalcEL.innerHTML = value;
    }
    get displayDate() {

        return this._dateCalcEl.innerHTML;
    }

    set displayDate(value) {

        this._dateCalcEl.innerHTML = value;
    }

    get displayCalc() {

        return this._displayCalcEL;
    }

    set displayCalc(value) {

        if(value.toString().length > 10){
            
            this.setError();
            return false;     
        }
        
        this._displayCalcEL.innerHTML = value;
    }

    get currentDate() {

        return new Date(); //Retorna uma na instância do objeto date
    }

    set currentDate(value) {

        this._timeCalcEL.innerHTML = value;
    }

    copyToClipBoard(){

        let input = document.createElement('input');

        input.value = this.displayCalc;    

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();

    }
    //Inicialiador do objeto
    initialize() {


        this.setDisplayDateTime();
        //Método que chama uma função no tempo deteminado
        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000) // 1000 milisegundos = 1 segundo

        this.setLastNumberToDisplay();
        
        
        document.querySelectorAll('.btn-ac').forEach(btn=>{
        
            btn.addEventListener('dblclick', e=>{
                
                this.toggleAudio();    

            });
        });
    }
    //Função que ativa e desativa o audio da calculadora
    toggleAudio(){
    
        this._audioOnOff = !this._audioOnOff
    }
    //Função tocar audio
    playAudio(){
     
        if(this._audioOnOff){

            this._audio.currentTime = 0;
            this._audio.play();    
        }
    }
    //Função que inicializa eventos do teclado
    initiBeyBoard() {

        document.addEventListener('keyup', e=>{

            this.playAudio()
            
            console.log(e.key);

            switch (e.key) {

                case 'Escape':
                    this.clearAll();
                    break;
    
                case 'Backspace':
                    this.clearEntry();
                    break;
    
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperator(e.key);
                    break;

                case '.':
                case ',':
                    this.addDot();
                    break;
    
                case 'Enter':
                case '=':
                    this.calc();
                    break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperator(parseFloat(e.key));
                    console.log(this.displayCalc);
                    break;
                
                case 'c':
                    if(e.ctrlKey) this.copyToClipBoard();
                    break;
    
                default:
                    this.setError();
                    break;
            }        
        });    
    }
    //Função que add eventos requeridos
    addEventListenerAll(element, events, fn) {
        //Funcionalidade que converte um string para array, neste caso o " " é o separador
        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);
        });
    }
    //Função que limpa toda a expressão
    clearAll() {

        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();

    }
    //Função que limpa a última entrada 
    clearEntry() {
        //Remove o último elemento do array 
        this._operation.pop();
        this.setLastNumberToDisplay();
    }
    //Busca a último item da operação 
    getLastOperation() {

        return this._operation[this._operation.length - 1];
    }
    //Função que concatena números
    setLastOperation(value) {

        this._operation[this._operation.length - 1] = value;
    }
    //Função que valida operadores na expressão
    isOperator(value) {
        //IndexOf retorna o index quando for igual ao parâmetro de entrada, caso não seja, retorna -1
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1)
    }
    //Função que add novos dados a expressão 
    pushOpetaion(value) {

        this._operation.push(value);

        if (this._operation.length > 3) {

            this.calc();

        }
    }
    //Função que calcula a expressão
    getResult() {

        return eval(this._operation.join(""));

    }
    //Função que executar o calculo
    calc() {

        let last = ''

        this._getLastOperator = this.getLastItem();
        //Se expressão for menor que 3 caracteres
        if (this._operation.length < 3) {

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this.lastNumber];

        }
        //Se expressão for maior que 3 caracteres
        if (this._operation.length > 3) {

            last = this._operation.pop();
            this._getLastNumber = this.getResult();
            //Se expressão for igual a 3 caracteres        
        } else if (this._operation.length == 3) {

            this._getLastNumber = this.getResult(false);
        }

        this._getLastOperator = this.getResult();

        let result = eval(this._operation.join(""));

        if (last == '%') {

            result /= 100;

            this._operation = [result];

        } else {

            this._operation = [result];

            if (last) this._operation.push(last);

        }

        this.setLastNumberToDisplay();

    }
    //Função que retonar o última item da expressão
    getLastItem(isOperator = true) {

        let lastItem;

        for (let i = this._operation.length - 1; i >= 0; i--) {

            if (this.isOperator(this._operation[i]) == isOperator) {

                lastItem = this._operation[i]
                break;

            }
        }

        if (!lastItem) {

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }
    //Função que coloca o último valor no display da calculadora
    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }
    //Função que add uma operação 
    addOperator(value) {

        //Valida se o último item do array não é um número 
        if (isNaN(this.getLastOperation())) {
            //Se for um operador
            if (this.isOperator(value)) {

                this.setLastOperation(value);
            } else {

                this.pushOpetaion(value);
                this.setLastNumberToDisplay();
            }
            //Outros casos
        } else {

            if (this.isOperator(value)) {

                this.pushOpetaion(value);

            } else {

                let newValue = this.getLastOperation().toString() + value.toString();

                this.setLastOperation(newValue);

                this.setLastNumberToDisplay();
            }
        }
    }
    //Função que dispara um erro
    setError() {

        this.displayCalc = "Error";
    }
    //Função que add o ponto na expressão
    addDot() {

        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;
        //Verifica se a última entrada na expressão é uma operação
        if (this.isOperator(lastOperation)) {
            this.pushOpetaion('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();
    }
    //Função que executa os btns
    execBtn(value) {

        this.playAudio()

        switch (value) {

            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;

            case 'soma':
                this.addOperator('+');
                break;

            case 'subtracao':
                this.addOperator('-');
                break;

            case 'multiplicacao':
                this.addOperator('*');
                break;

            case 'divisao':
                this.addOperator('/');
                break;

            case 'porcento':
                this.addOperator('%');
                break;

            case 'ponto':
                this.addDot();
                break;

            case 'igual':
                this.calc();
                break;


            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperator(parseFloat(value));
                break;

            default:
                this.setError();
                break;
        }

    }
    //Iniciando evento dos btns
    initButtonsEvents() {

        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        //Add um evento para cada item da lista
        buttons.forEach((btn, index) => {
            //Add evento de click e drag
            this.addEventListenerAll(btn, 'click drag', e => {

                //Texto extraído do btn 
                let textBtn = btn.className.baseVal.replace("btn-", "");//baseBal para pegar o valor de um SGV
                this.execBtn(textBtn);
            });
            //Add ao evento mouseover, mouseup e mousedown o style de ponteiro no cursor do mouse
            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e => {

                btn.style.cursor = "pointer";
            });
        });
    }
    //Função que inicia a Data e Hora 
    setDisplayDateTime() {

        this.displayDate = this.currentDate.toLocaleDateString(this._locale, this._localeOptions); //Retorna data no formato BR
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale, this._localeOptionsTime); //Retorna hora no formato BR    
    }

}