/**
 * Created by Administrator on 2018/8/26.
 */
app.register.controller('user-management', function ($scope, $timeout,ApplicationService, _validate) {

    'use strict';

    var ajaxParams = {
            type:'',
            name:'',
            status:'',
            startTime:'',
            endTime:'',
            page:'1'
        },
        paginData = { // �洢��ҳ����
            currentPage :'',
            from:'',
            to:'',
            lastPage:'',
            perPage:10,
            total:0,
            inputCurPage:''
        };

    $scope.addAjaxParams = {
        type:'',
        name:'',
        logo:'',
        money:'',
        num:'',
        rank:'',
        note:'',
        packName:'',
        urlscheme:'',
    },
        $scope.state = {
            isShowAdd:'',//�Ƿ���ʾ
            isiOS:1,// Ӧ������ 0Ϊ��׿ 1ΪiOS
            file:'',
            // ��ҳ
            hasMoreData:false, //�Ƿ���ʣ���ҳ����
            showPagin:false, // �Ƿ���ʾ��ҳ
            currentPage:'', // ��ǰҳ��
            lastPage:'',// ���һҳ
            total:'',//��ҳ��
            dataNone: false
        };

    // ��ȡ�б�����
    $scope.list = [];
    $scope.search = {
        type:'',
        name:'',
        status:'',
        startTime:'',
        endTime:'',
        page:'1'
    };
    var getAppUserList = function(opt, cb, cberr) {
            ApplicationService.getAppUserList(opt)
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        getAppUserListHandler = function(data) {
            console.log(data)
            $scope.list = data.data;
            $scope.page = data;
            if(data.data.length == 0){
                $scope.state.dataNone = true;
            }else{
                $scope.state.dataNone = false;
            }

            comparePagin(paginData, data); // �����ҳ����
            $scope.state.showPagin = (data.lastPage > 1);
            $scope.state.hasMoreData = (data.currentPage < data.lastPage);
        };

    getAppUserList(ajaxParams, getAppUserListHandler);

    // -- �����û�״̬
    var changeStatus = function(opt, cb, cberr) {
            ApplicationService.changeUserStatus(opt)
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        changeStatusHandler = function(data) {
            console.log(data)
            layer.closeAll();
            if(data && data['__state'] && data['__state'].code === 200) {
                layer.alert(data['__state'].msg, function () {
                    window.location.reload();
                });
                //getTeamMateList(ajaxParams, getTeamMateListHandler);
            }
        };


    // ƥ��ģ���еĲ��� �� �������
    var matchAjaxParams = function(modelParams, reqParams) {
            var temp = '';
            for(var key in modelParams) {
                temp = modelParams[key] !== ''?modelParams[key]:'';
                reqParams[key] = temp;
            }
            return reqParams;
        },
    // �ԱȲ���ʾ��ҳ����
        comparePagin = function(target, source) {
            target.currentPage = parseInt(source.currentPage, 10);
            target.from = parseInt(source.from, 10);
            target.to = parseInt(source.to, 10);
            target.lastPage = parseInt(source.lastPage, 10);
            target.perPage = parseInt(source.perPage, 10);
            target.total = parseInt(source.total, 10);

            $scope.state.currentPage = target.currentPage;
            $scope.state.lastPage = target.lastPage;
            $scope.state.total = target.total;

            return target;
        };

    $scope.cb = {
        uploadImgBanner:function(data) {
            uploadImg({base64File:data} ,uploadBanner);
        }
    };

    $scope.act = {
        // ���ذ�ť�¼�
        doSearch: function() {
            $scope.search.page = 1;
            ajaxParams = matchAjaxParams($scope.search, ajaxParams);
            getAppUserList(ajaxParams, getAppUserListHandler);
        },
        goPrePage:function() { // ��һҳ
            if(paginData.currentPage > 1) {
                $scope.search.page = parseInt(paginData.currentPage, 10) - 1;
                ajaxParams.page = $scope.search.page;
                getAppUserList(ajaxParams, getAppUserListHandler);
            }
        },
        goNextPage:function() { // ��һҳ
            if(paginData.currentPage < paginData.lastPage) {
                $scope.search.page = parseInt(paginData.currentPage, 10) + 1;
                ajaxParams.page = $scope.search.page;
                getAppUserList(ajaxParams, getAppUserListHandler);
            }
        },
        goToPage:function() {
            var isNum = /^\d+$/gi,
                num = 0;
            if(isNum.test($.trim( $scope.search.inputCurPage ))) {
                num = parseInt($scope.search.inputCurPage, 10);
                if(num < 1) {
                    num = 1;
                }
                if(num > paginData.lastPage){
                    num = paginData.lastPage;
                }
                $scope.search.page = num;
            }else {
                $scope.search.page = 1;
            }
            ajaxParams.page = $scope.search.page;
            getAppUserList(ajaxParams, getAppUserListHandler);
        },
        keyGoToPage:function(e) {
            var keyCode = +e.keyCode;
            if(keyCode === 13) {
                this.goToPage();
            }
        },
        addApplication: function () {
            $scope.state.isShowAdd = true;//��ʾ�����б�
            $timeout(function(){
                layer.open({
                    type: 1
                    ,title: false //����ʾ������
                    ,closeBtn: false
                    ,area: ['680px','auto']//��ʼ��Layer�߶�
                    ,shade: 0.8
                    ,btn: ['���', 'ȡ��']
                    ,content: $('#addApp')
                    ,yes: function(){
                        $scope.addAjaxParams.type = $scope.state.isiOS;

                        //function showResponse(data) {
                        //    console.log(data)
                        //}
                        //var options = {
                        //    url:'/admin/app/add',
                        //    beforeSubmit:  $scope.addAjaxParams,  //�ύǰ����
                        //    success:       showResponse,  //�������
                        //    resetForm: true,
                        //    dataType:  'json'
                        //};
                        //
                        //$('.index_form').submit(function() { //ע�������index_form
                        //    $(this).ajaxSubmit(options);
                        //    return false;//��ֹdialog �Զ��ر�
                        //});
                        //
                        //return false;

                        //var formdata = new FormData($$('form')[0]);
                        $.ajax({
                            url: '/admin/app/add',
                            type: 'GET  ',
                            datatype: 'json',
                            data: $scope.addAjaxParams,
                            cache:false,
                            traditional: true,
                            contentType: false,
                            processData: false,
                            success: function (data) {},
                            error: function () {}
                        });

                        //if(!_validate.isRequired(postData.weight)) {
                        //layer.alert('����дȨ��');
                        //return false;
                        //}

                        //getApplication($scope.addAjaxParams,addApplicationHandler);
                        $scope.state.showEditList = false;
                        layer.closeAll();

                    }
                    ,btn2: function(){
                        console.log($scope.state.number);
                        $scope.state.showEditList = false;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    }
                    ,success: function(layero){
                        layero.find('.layui-layer-btn').css('text-align', 'center');
                        $('.layui-layer-content').css({'height':'auto','overflow':'visible'});
                    }
                });
            },0);
        },
        changeStatus: function (id,status) {
            layer.load(2)
            changeStatus({userId:id,status:status},changeStatusHandler)
        }
    };
});