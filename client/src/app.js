var Tab = Object.freeze({
    products: 1,
    purchases: 2,
    stats: 3
});

var blank_product_row = Object.freeze({
    id: '',
    name: '',
    unit: '',
    def_q: '',
});

var app = {

    init: function () {
        this.data = {
            products: [],
            purchases_by_date: [],
            purchases_offset: 0,
            all_purchases_loaded: false
        };
        this.table_rows = {
            products: [],
            purchases: []
        };
        this.state = {
            last_clicked_product_row: blank_product_row,
            tab: Tab.products,
            activate_modal: false,
            modal_product_list: false,
        };
        this.cacheDom();
        //this.changeState();
        this.load('products').done(this.changeState.bind(this));
        this.load('purchases');
    },
    load: function (type) {
        if(type == 'purchases'){
            return $.getJSON(`/get_purchase_list/${this.data.purchases_offset}/${50}`,(function(data){
                /*
                if(data.purchases_by_date.length == 0)
                {
                    this.data.all_purchases_loaded = true;
                }
                */
                this.data.purchases_by_date.push(...data.purchases_by_date);
                this.data.purchases_offset+=1;
            }).bind(this));
        }
        else{ // type == products
            return $.getJSON('/get_product_list',(function(data){
                this.data.products = data.products;
            }).bind(this));
        }
    },
    cacheDom: function () {
        this.$products_div = $('#products_div');
        this.$purchases_div = $('#purchases_div');
        this.$button_new = $('#button_new');

        this.$modal = $('#exampleModal');
        this.$modal_body = $('#modal_body');

        this.product_form = {
            $form: $('#product_form'),
            $id: $('#prf_id'),
            $name: $('#prf_name'),
            $unit: $('#prf_unit'),
            $def_qnt: $('#prf_default_quantity'),
            $del_check_box: $('#prf_checkbox_delete')
        };
        this.purchases_form = {
            $form: $('#purchases_form'),
            $id: $('#pf_purchase_id'),
            $product: $('#pf_product_name'),
            $qnt: $('#pf_quantity'),
            $cost: $('#pf_cost'),
            $date: $('#pf_date'),
            $comment: $('#pf_comment'),
            $del_check_box: $('#pf_checkbox_delete')
        };

        this.$navbar_purchases_link = $('#navbar_purchases_link');
        this.$navbar_product_link = $('#navbar_products_link');
        this.$radioEdit = $('#radio_edit_on');
    },
    constructProductTable: function(){   
        this.table_rows.products = [];
        let $tbody = $('<tbody>');
        let $table = $('<table>').addClass('table table-hover table-striped').append($tbody);
        for (let i = 0; i < this.data.products.length; ++i) {
            let p = this.data.products[i];
            let $row = $('<tr>').append($('<td>').text(p.name));
            $tbody.append($row);
            // cache rows
            this.table_rows.products.push($row);
        }
        return $table;
    },
    render: function () {

        if (this.state.tab == Tab.products) {

            this.$product_table = this.$product_table || this.constructProductTable();

            if (this.state.activate_modal) // modal
            {
                this.purchases_form.$form.hide();
                this.product_form.$form.show();

                let pr = this.state.last_clicked_product_row;
                this.product_form.$id.attr('value', pr.id);
                this.product_form.$name.attr('value', pr.name);
                this.product_form.$unit.attr('value', pr.unit);
                this.product_form.$def_qnt.attr('value', pr.def_q);
                this.$modal.modal('show');
            } else {
                // change active tab of navbar buttons
                this.$navbar_purchases_link.addClass('active');
                this.$navbar_product_link.removeClass('active');
                // hide purchases table
                this.$purchases_div.hide();
                this.$products_div.show();

                //this.$products_div.find('table').remove();
                this.$products_div.append(this.$product_table);
                this.$product_table.show();
            }
        } else if (this.state.tab == Tab.purchases) {

            //this.$purchase_table = this.$purchase_table || this.constructPurchasesTable();
            this.$product_table.hide();

            if (this.state.activate_modal) // modal
            {
                this.product_form.$form.hide();
                if(this.state.modal_product_list){
                    this.purchases_form.$form.hide();
                    this.$modal_body.append(this.$product_table);
                    this.$product_table.show();
                }
                else{
                    this.$product_table.hide();
                    this.purchases_form.$product.attr('value',this.state.last_clicked_product_row.name);
                    this.purchases_form.$form.show();
                }
                this.$modal.modal('show');
            } else {
                // change active tab of navbar buttons
                this.$navbar_purchases_link.removeClass('active');
                this.$navbar_product_link.addClass('active');
                // 
                this.$products_div.hide();
                this.$purchases_div.show();

                // clear
                this.$purchases_div.empty();

                for (let i = 0; i < this.data.purchases_by_date.length; ++i) {
                    let date = this.data.purchases_by_date[i].date;
                    let purchases = this.data.purchases_by_date[i].purchases;

                    let $header_div = $('<div>').addClass('d-flex justify-content-between').append($('<h3>').text(date));
                    let $tbody = $('<tbody>');
                    let $table = $('<table>').addClass('table table-sm table-striped table-hover').append($tbody);
                    let $table_div = $('<div>').addClass('table-responsive').append($table);
                    this.$purchases_div.append($header_div).append($table_div);

                    for (let j = 0; j < purchases.length; ++j) {
                        let p = purchases[j];
                        let $row = $('<tr>');
                        $row.append($('<td>').text(p.product));
                        $row.append($('<td>').text(p.quantity));
                        $row.append($('<td>').text(p.cost_rub));
                        $row.append($('<td>').text(p.comment));
                        $tbody.append($row);
                        this.table_rows.purchases.push($row);
                    }
                }
            }
        } else if (this.state.tab == Tab.stats) {
            //
        }
    },
    changeState: function (e) {
        if(e.data)
        {
            this.state.tab = e.data.tab || this.state.tab;
            this.state.last_clicked_product_row = e.data.product_row || blank_product_row;
            this.state.activate_modal = e.data.modal || false;
            this.state.modal_product_list = e.data.modal_product_list || false;
        }
        this.render();
        this.bindEventListeners();
    },
    bindProductTableEventListeners: function(){
        for (let i = 0; i < this.data.products.length; ++i) {
            let p = this.data.products[i];
            let $row = this.table_rows.products[i];
            let event_params = {
                product_row: {
                    id: p.id,
                    name: p.name,
                    unit: p.unit,
                    def_q: p.default_quantity
                },
                modal: true
            };
            $row.off('click').on('click', event_params, this.changeState.bind(this));
        }
    },
    bindEventListeners: function () {
        $(window).off();

        this.$navbar_purchases_link.off('click').on('click', {
            tab: Tab.purchases
        }, this.changeState.bind(this));
        this.$navbar_product_link.off('click').on('click', {
            tab: Tab.products
        }, this.changeState.bind(this));

        if (this.state.tab == Tab.products) {
            this.bindProductTableEventListeners();
            // change button_new event
            this.$button_new.off('click').on('click', {
                tab: Tab.products,
                modal: true
            }, this.changeState.bind(this));
        } else if (this.state.tab == Tab.purchases) {

            $('#button_next').off().on('click', (function(){
                this.data.purchases_offset += 10;
                this.load('purchases',this.data.purchases_offset).done(this.changeState.bind(this));
            }).bind(this));

            if(this.state.activate_modal){
                if(this.state.modal_product_list){
                    this.bindProductTableEventListeners();
                }
                else{
                    this.purchases_form.$product.off('click').on('click', {
                        tab: Tab.purchases,
                        modal: true,
                        modal_product_list: true
                    }, this.changeState.bind(this));
                }
            }
            else{
                /*
                {
                    // if not all data has been loaded yet:
                    //   if scrollbar is visible and it's on the bottom 
                    //     or if there is no scrollbar, 
                    //          load the data
                    $(window).scroll((function() {
                        //let there_is_no_scrollbar = function(){
                        //    return this.get(0).scrollHeight <= this.height();
                        //};
                        let scrollbar_is_on_the_bottom = function(){
                            return $(window).scrollTop() + $(window).height() == $(document).height();
                        };
                        //if(this.data.all_purchases_loaded == false && (there_is_no_scrollbar || scrollbar_is_on_the_bottom) )
                        if(this.data.all_purchases_loaded == false && scrollbar_is_on_the_bottom())
                        {
                            this.load('purchases',this.data.purchases_offset).done(this.changeState.bind(this));
                        }
                    }).bind(this));
                }
                */

                for (let i=0; i <  this.table_rows.purchases.length; ++i) 
                {
                    let $row = this.table_rows.purchases[i];
                    let event_params = {
                        tab: Tab.purchases,
                        modal: true
                        // TODO: set input fields 
                    };
                    $row.off('click').on('click', event_params, this.changeState.bind(this));
                }
            }
            this.$button_new.off('click').on('click', {
                tab: Tab.purchases,
                modal: true
            }, this.changeState.bind(this));

        } else if (this.state.tab == Tab.stats) {
            //
        }
    }
};

export default app;