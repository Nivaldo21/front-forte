export default interface Transaccion {
    _id?: string;
    transaccion_id: number | undefined;
    cliente_id: number | string |null;
    cantidad: number;
    categoria: string;
    fecha: string; 
    tipo: "income" | "expense";
    estado: boolean | undefined;
}