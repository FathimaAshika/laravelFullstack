

$('#checkout_btn').on('click', function () {
    var amount = $('#amount').val();
    var token = $('#token').val();
    
   // localStorage.setItem('token', token);
    var fullname = $('#fullname').val();
    var reference_id = $('#student_ref').val();
    var randNum = $('#randNum').val();
    var account_no = '9012334444';
    var payment_type_id = $('input.payment_type:checked').val();
    //alert(server_url);
    submitPayments();
});

function PaymentGatewayMyAccount(type, data) {
    if (type == 1) {
        sampathPayment(data, data.reference_id);
    }
    if (type == 2) {
        //window.location = server_url+'amex/choose/transaction?amount=' +data.amount+ '&reference_id='+data.reference;
        amexPayment(data);
    }
    if (type == 3) {
        //window.location = server_url+'dialog/send?amount=' +data.amount+ '&reference_id='+data.reference;
        vishwaPayment(data.amount, data.reference_id, data.fullname);

    }
    if (type == 4) {
        cargillsMsgBox('003950000171', data.reference_id, data.amount);
        // window.location=server_url+'paymentgateway/mobitel/send?amount='+data.amount+'&reference_id='+data.reference ;

    }
    if (type == 5) {
        giftMsgBox(data, data.reference_id, data.signup_token);
    }
    if (type == 6) {
        directDebitMsgBox('025100004630', data.reference_id, data.amount);
    }
    if (type == 7) {

        dialogPayment(data.amount, data.reference_id);
    }
    if (type == 8) {
        mobitelPayment(data.amount, data.reference_id);
        // window.location=server_url+'paymentgateway/mobitel/send?amount='+data.amount+'&reference_id='+data.reference ;
    }
}

function sampathPayment(data) {
    var msg = '';
    var randNum = data.randNum;
    bootbox.confirm({
        title: "Visa & Master Cards",
        message: '<ul>'
                + '<li>Visa / Master Card Payment Confirmation <br/>(Sampath Bank Payment Gateway) <br/>Payment Amount: Rs. ' + data.amount + '.</li>'
                + '</ul>',
        className: 'checkout_confirm_box footer_active ',
        buttons: {
            confirm: {
                label: 'Continue',
                className: 'materialize btn_green login_ok sp '
            },
            cancel: {
                label: 'Cancel',
                className: 'btn_red sp'
            }
        },
        callback: function (result) {

            if (result) {
                $('.modal-body').html('');
                $('.modal-body').append('<div class="saving loader_"><div><h3>Please be patient. Redirecting to the Sampath Bank Payment Gateway<span>.</span><span>.</span><span>.</span></h3></div></div>')
                $('.modal-footer').hide();
                var gateway_url = 'sampath/token/response';
                var d = new Date();
                var requestDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();

                var paymentdata = {
                    clientId: 14000631,
                    paymentAmount: data.amount,
                    operation: 'PAYMENT_INIT',
                    requestDate: requestDate,
                    validateOnly: false,
                    transactionType: 'PURCHASE',
                    tokenize: false,
                    clientRef: data.reference_id + '-' + randNum,
                    comment: 'student_registration_id_and_random_no',
                    msisdn: randNum,
                    sessionId: randNum,
                    currency: 'LKR',
                    returnMethod: 'GET',
                    returnUrl: '',
                    tokenReference: 'tokenReference'
                }
                // console.log(paymentdata.clientRef);


                $.ajax({
                    url: server_url + '' + gateway_url,
                    type: 'POST',
                    data: paymentdata,
                    success: function (data) {
                        // console.log(data);
                        if (data.status == '200') {
                            window.location = data.payment_url;
                        }

                    },
                    error: function (data) {
                        // console.log(data);
                    }
                })

                return false;
            }

        }
    });
}
function dialogPayment(amount, reference) {
    var reference_id = reference + '-';
    var message = '';
    var msg = '';
    $.ajax({
        url: server_url + 'dialog/send',
        type: 'POST',
        data: {
            amount: amount,
            reference_id: reference_id
        },
    })
            .done(function (result) {

                bootbox.confirm({
                    title: "Dialog eZ Cash Payment ",
                    message: '<ul>'
                            + '<li>Are you sure you need to proceed to checkout with Dialog eZ Cash? The amount for the package you have chosen is Rs. ' + amount + '.</li>'
                            + '<form action="https://ipg.dialog.lk/ezCashIPGExtranet/servlet_sentinal" method="post">'
                            + ' <input type="hidden" value=" ' + result.invoice + '" name="merchantInvoice"><br/><br/>'
                            + '<div class="footer_btns pull-right">'
                            //+ '<input type="submit"  style="font-size: 13px; background: #87ccba; color: #014b70; display: block; margin: auto; padding: 8px 20px; border-radius:0; font-family: Montserrat-Regular;" value="Checkout Here" name="Checkout" class="btn-success waves-effect waves-button waves-float"></div>'
                            + '<div class="footer_btns pull-right">'
                            + '<button type="reset" value="Cancel" name="cancel" class="btn btn_red waves-effect waves-button waves-float btn-cancl" data-dismiss="modal">Cancel</button>'
                            + '<button type="submit" value="Checkout" name="Checkout" class="btn btn_green waves-effect waves-button waves-float btn-check-dialog">Continue</button>'
                            + '</div>'
                            + '</form></ul>',
                    className: 'checkout_confirm_box footer_active ',
                    buttons: {
                        confirm: {
                            label: 'Checkout',
                            className: 'materialize login_ok hide'
                        },
                        cancel: {
                            label: 'No',
                            className: 'btn-danger hide'
                        }
                    },
                    callback: function (result) {
                        // loadPage_login('');
                        window.location = server_url + '/dialog/send';
                    }
                });
            })
            .fail(function () {
                bootbox.confirm({
                    title: "Dialog Payment Info Generating Failed",
                    message: '<ul>'
                            + '<li>Error in Generating Sensitive data </li>'
                            + '<p>Please try again</p>'
                            + '</ul>',
                    className: 'checkout_confirm_box ',
                    buttons: {
                        confirm: {
                            label: 'Checkout',
                            className: 'materialize login_ok '
                        },
                        cancel: {
                            label: 'No',
                            className: 'btn-danger hide'
                        }
                    },
                    callback: function (result) {
                        //window.location = 'http://192.168.1.12:8003/login';
                        window.location = 'http://35.154.18.131:8003/login';
                    }
                });
            })
            .always(function () {
                console.log("complete");
            });
}


function amexPayment(data) {
    var message = '';
    var msg = '';
    bootbox.confirm({
        title: " American Express ",
        message: '<ul>'
                + '<li>Amex Payment Confirmation <br/>(Nations Trust Bank Payment Gateway) <br/>Payment Amount: Rs. ' + data.amount + '.</li>'
                + '<form method="POST" action="' + server_url + 'amex/encrypt/transaction/info">'
                + '<input type="hidden" name="cur"  value="LKR" >'
                + ' <input name="action" type="hidden" value="SaleTxn" >'
                + '<input type="hidden" name="txn_amt" value=" ' + data.amount + '.00" >'
                + '<input type="hidden" name="mer_id"  value="TUTORWIZARD">'
                + '<input type="hidden" name="mer_txn_id"  value="' + data.reference_id + '-' + data.randNum + '" ><br/><br/>'
                + '<div class="footer_btns pull-right">'
                + '<button type="reset" value="Cancel" name="cancel" class="btn btn_red waves-effect waves-button waves-float btn-cancl" data-dismiss="modal">Cancel</button>'
                + '<button type="submit" value="Checkout" name="Checkout" class="btn btn_green waves-effect waves-button waves-float btn-check">Continue</button>'
                + '</div>'
                + '</ul>',
        className: 'checkout_confirm_box footer_active ',
        buttons: {
            confirm: {
                label: 'Checkout',
                className: 'materialize login_ok hide'
            },
            cancel: {
                label: 'No',
                className: 'btn-danger hide'
            }
        },
        callback: function (result) {
            // loadPage_login('');
            window.location = '';
        }
    });
}

function vishwaPayment(amount, ref, fullname) {
    var msg = '';
    bootbox.confirm({
        title: "Sampath Vishwa Payment",
        message: '<ul>'
                + '<li>Student Name: ' + fullname + '</li>'
                + '<li>Reference No: ' + ref + '</li>'
                + '<li>Payment Amount: Rs. ' + amount + '</li>'
                + '<li>Account No: 011510000961</li>'
                + '</ul>'
                + '<p>Thank you for choosing Sampath Vishwa Payment. Once you proceed you will be directed to the Sampath Vishwa Portal, please provide your Reference no when you make your transaction. Once your payment is completed the activation can take anywhere up to 24 hours. Please check your Email for further details. Thank you again for choosing Tutor wizard.</p>',
//		className: 'confirm_box ',
        className: 'checkout_confirm_box footer_active ',
        buttons: {
            confirm: {
                label: 'Continue',
                className: 'materialize btn_green'
            },
            cancel: {
                label: 'Cancel',
                className: 'materialize btn_green'
            }
        },

        callback: function (result) {
            if (result) {
                window.location = 'https://www.sampathvishwa.com/SVRClientWeb/ActionController';
            }

        }
    });
}
function cargillsMsgBox(account, ref, amount) {
    var msg = '';
    bootbox.confirm({
        title: "Pay at Cargills",
        message: '<ul>'
                + '<li>Company Name: Edickson Lanka (PVT) LTD</li>'
                + '<li>Bank Name: Cargills Bank</li>'
                + '<li>Payment Amount: Rs. ' + amount + '</li>'
                + '<li>Account No: ' + account + '</li>'
                + '<li>Reference No: ' + ref + '</li>'
                + '</ul>'
                + '<p>Please make the payment within 5 days from now and kindly send us the copy of the bank remittance form for a prompt activation. <br/>Send to our email – payments@tutorwizard.lk or MMS/Viber/WhatsApp to our hotline number 0777740877</p>',
        className: 'checkout_confirm_box footer_active ',
        buttons: {
            confirm: {
                label: 'Continue',
                className: 'materialize btn_green'
            },
            cancel: {
                label: 'Cancel',
                className: 'materialize btn_green'
            }
        },

        callback: function (result) {
            if (result) {
                window.location = login_url;
            }

        }
    });
}

function giftMsgBox(data, ref, signuptoken) {
    var refID = ref + '-' + data.randNum;
    // console.log(refID)
    var msg = '';
    bootbox.confirm({
        title: "Gift Cards",
        message: '<div class="col-md-6 gift_popup margin1"><label> Card No:  </label><br/>'
                + '<input type="text" id="card_no" class="giftcard_inbox no-spin" maxlength="16"></div>'
                + '<div class="col-md-6 gift_popup"><label> PIN No:  </label><br/>'
                + '<input type="text" id="pin_no" class="giftcard_inbox no-spin" maxlength="10" ></div>',
        className: 'checkout_confirm_box footer_active',
        buttons: {
            confirm: {
                label: 'Confirm',
                className: 'materialize login_ok '
            },
            cancel: {
                label: 'Cancel',
                className: 'materialize login_ok'
            }
        },

        callback: function (result) {
            var card = $("#card_no").val();
            var pin = $("#pin_no").val();
            var data = {card_number: card, pin_number: pin, signup_token: signuptoken, reference_id: refID}

            if (result == true) {
                $.ajax({
                    url: server_url + 'make/payment/giftvoucher',
                    type: 'POST',
                    data: data,
                    success: function (result) {
                        // console.log(result);
                        var giftstatus = parseInt(result.status)
                        if (giftstatus == 200) {
                            giftpayMsgBox("Payment Successful", "Thank you for joining Tutor Wizard, we hope you enjoy your experience. Please check your e-mail for your invoice and log-in details.");

                        } else if (giftstatus == 201) {
                            giftpayMsgBox("Irrelevant Card ", "The card you entered is irrelevent for your grade.");

                        } else {
                            giftpayMsgBox("Payment Failed", "We are sorry but your payment attempt has failed. Please try again. If you need any assistance, do not hesitate to contact us 0112 577 587 or e-mail payments@tutorwizard.lk. Thank you.");

                        }
                    }
                });

            } else {
            }
        }
    });
}

function giftpayMsgBox(type, msg) {


    bootbox.alert({
        title: type,
        message: msg,
        className: 'checkout_confirm_box footer_active ',
        buttons: {
            confirm: {
                label: 'Ok',
                className: 'materialize login_ok '
            },
            cancel: {
                label: 'Cancel',
                className: 'materialize login_ok'
            }
//            ok: {
//                label: 'Continue',
//                className: 'materialize btn_green'
//            }
        },
        callback: function (result) {
            //if(result){
                window.location = login_url; 
           // }        
        }
    });

}


function directDebitMsgBox(account, ref, amount) {
    var msg = '';
    bootbox.confirm({
        title: "Bank Transfer or Standing Order",
        message: '<ul>'
                + '<li>Company Name: Edickson Lanka (PVT) LTD</li>'
                + '<li>Bank Name: Nations Trust Bank</li>'
                + '<li>Payment Amount: Rs. ' + amount + '</li>'
                + '<li>Account No: ' + account + '</li>'
                + '<li>Reference No: ' + ref + '</li>'
                + '</ul>'
                + '<p style="text-align:justify">Please make the payment within 5 days from now and kindly send us the copy of the bank remittance form for a prompt activation. <br/>Send to our email – payments@tutorwizard.lk or MMS/Viber/WhatsApp to our hotline number 0777740877</p>',
        className: 'checkout_confirm_box footer_active ',
        buttons: {
            confirm: {
                label: 'Continue',
                className: 'materialize btn_green'
            },
            cancel: {
                label: 'Cancel',
                className: 'materialize btn_green'
            }
        },

        callback: function (result) {

            if (result) {
                window.location = login_url;
            }

        }
    });
}

function mobitelPayment(amount, reference) {
    var msg = '';
    bootbox.confirm({
        title: "Mobitel mCash Payment",
        message: '<ul>'
                + '<li>Are you sure you need to proceed to checkout with Mobitel mCash? The amount for the package you have chosen is Rs. ' + amount + '.</li>'
                + '</ul>',
        className: 'checkout_confirm_box footer_active ',
        buttons: {
            confirm: {
                label: 'Continue',
                className: 'materialize btn_green login_ok'
            },
            cancel: {
                label: 'Cancel',
                className: 'btn_red'
            }
        },

        callback: function (result) {
            if (result) {
                $('.modal-body').html('');
                $('.modal-body').append('<div class="saving loader_"><div><h3>Please be patient. Redirecting to the payment gateway<span>.</span><span>.</span><span>.</span></h3></div></div>')
                $('.modal-footer').hide();
                var gateway_url = 'paymentgateway/mobitel/send';
                var paymentdata = {
                    amount: amount,
                    reference_id: reference
                }


                $.ajax({
                    url: server_url + '' + gateway_url,
                    type: 'POST',
                    data: paymentdata,
                    success: function (data) {
                        // console.log(data);
                        $('.modal').html('');
                        if (data.status == '200') {
                            window.location = data.payment_url;
                        } else {
                            giftpayMsgBox('Failed', 'Server error , Please try again');
                            //$('.checkoutpop').modal('hide');
                        }
//                                                if (data.status=='200') {
//				window.location =  data.payment_url;
//			}
//			if (data.status=='401') {
//				customMsgBox('Server error','Server error. Please try again.');
//				$('.checkoutpop').modal('hide');
//			}
                        //window.location =login_url;       
                    },
                    error: function (data) {
                        // console.log(data);
                    }
                })
                //window.location =login_url;
                return false;

            }
        }
    });

}


function proceedToCheckout(selectedOption) {
    var msg = '';

    bootbox.confirm({
        title: "Proceed to Checkout",
        message: '<p>Are you sure you need to proceed to checkout? The amount for the package you have chosen is Rs. x,xxx /- .</p>',
        className: 'confirm_box',
        buttons: {
            confirm: {
                label: 'Proceed',
                className: 'btn_green'
            },
            cancel: {
                label: 'Cancel',
                className: 'btn_red'
            }
        },
        callback: function (result) {

            if (result) {

                call(null, 'student/make/payment', function (status, data) {
                    if (data) {
                        if (selectedOption) {
                            PaymentGatewayMyAccount(selectedOption.val(), data);
                        }
                    }
                });

            } else {



            }


        }
    });

}

function submitPayments() {
    //var selectedOption = $("input:radio[name=payment_type][check_cancel=true]:first");
    var selectedOption = $('input.payment_type:checked');
    if (typeof selectedOption.val() !== 'undefined') {
//		if(isUpdatePackage) {
//
//
//			var updateData = {
//				package_id: $('#subjects').val(),
//				payment_method: selectedOption.attr('data-item-name')
//			}
//			callServerToUpdatePackage(updateData, function(state) {
//				if(state) {
//					call(null, 'student/make/payment', function(status, data) {
//						if(data) {
//							// console.log(data)
//							if(selectedOption) {
//								PaymentGatewayMyAccount(selectedOption.val(), data);
//							}
//						}
//					})
//				}
//			}) 
//		} else {
        // direct payment without package updating implement here
        //proceedToCheckout(selectedOption)
        call(null, 'student/make/payment', function (status, data) {
            if (data) {
                // console.log(data)
                if (selectedOption) {
                    PaymentGatewayMyAccount(selectedOption.val(), data);
                }
            }
        });

        //}
    } else {
        selectPaymentMsgBox();
    }
}

function call(vars, fu, callback) {
    try {
        if (vars.isPost != undefined) {
            if (vars.isPost) {
                callPostRequest(vars, fu, function (response) {
                    return callback(response.status, response.data);
                })
            }
        }
    } catch (err) {
        // console.log(err);
    }
    var data = '';
    //var token = 'test_student';
    try {
        if (vars.ids != undefined) {
            data = '/' + vars.ids.join('/');
        }
    } catch (err) {

    }
    try {
        if (vars.data != undefined) {
            data += '/' + JSON.stringify(vars.data);
        }
    } catch (err) {

    }

    var svr_url = server_url;

    try {
        if (vars.isresources != undefined) {
            svr_url = getFileManager();
        }
    } catch (err) {

    }

    var token = localStorage.getItem('token');
    var call_url = svr_url + fu + '/' + token + data;
    var cache_name = fu + '/' + token + data;
    if (vars != null) {
        if (vars.from_ajax != undefined) {
            if (vars.from_ajax) {
                sessionStorage.removeItem(cache_name);
            }
        }
    }
    if (sessionStorage.getItem(cache_name) == null) {
        //console.log("%cCalling "+call_url+ " from ajax", 'color: blue');
        $.ajax({
            url: call_url,
            success: function (result) {
                callback(result.status, result.data);
                //sessionStorage.setItem(cache_name,btoa(JSON.stringify(result)));
            },

            error: function (result) {
                return;
            }
        });
    } else {
        var result = JSON.parse(atob(sessionStorage.getItem(cache_name)));
        //console.log("%cCalling "+call_url+ " from cache",' color: green');
        callback(result.status, result.data);
    }
}
;

function selectPaymentMsgBox() {
    var msg = '';

    bootbox.alert({
        title: "Select a payment option",
        message: '<p>Please select a payment option to proceed checkout. </p>',
        className: 'confirm_box',
        buttons: {
            ok: {
                label: 'Continue',
                className: 'materialize btn_green'
            }
        }
    });

}
$('#cancel_btn').on('click', function () {
    window.location = login_url;
});