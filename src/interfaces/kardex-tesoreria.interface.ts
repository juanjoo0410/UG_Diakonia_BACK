export interface IKardexTesoreria {
    id?: number;
    cajaBancoId: number;
    documentoId: number;
    numero: string;
    fecha:Date;
    tipo: string;
    descripcion: string;
    tipoValor: string;    
    esDebito: boolean;
    valor: number;
    creadorId: number;
}