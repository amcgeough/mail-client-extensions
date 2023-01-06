class Purchase {
    id: number;
    name: string;
    original_email_id: string;

    static fromJSON(o: Object): Purchase {
        const purchase = new Purchase();
        purchase.id = o['purchase_id'];
        purchase.name = o['name'];
        purchase.original_email_id = o['original_email_id'];
        return purchase;
    }

    static copy(purchase: Purchase): Purchase {
        const newPO = new Purchase();
        newPO.id = purchase.id;
        newPO.name = purchase.name;
        newPO.name = purchase.original_email_id;
        return newPO;
    }

}

export default Purchase;
