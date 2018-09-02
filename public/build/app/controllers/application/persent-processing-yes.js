/**
 * Created by Administrator on 2018/8/26.
 */
app.register.controller('persent-processing-yes', function ($scope, $timeout,ApplicationService, _validate) {

    'use strict';

    var ajaxParams = {
            status:2,//����״̬ 1Ϊ������ 2Ϊ���ֳɹ�
            nickname:'',//�û��ǳ�
            mobile:'',//�û��ֻ���
            alipay:'',//	�����˺�
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
            iOSNum:0,
            androidNum:0,
            totleNum:0,
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
        status:'',//����״̬ 1Ϊ������ 2Ϊ���ֳɹ�
        nickname:'',//�û��ǳ�
        mobile:'',//�û��ֻ���
        alipay:'',//	�����˺�
        page:'1'
    };
    var getAPersentNoList = function(opt, cb, cberr) {
            ApplicationService.getAPersentList(opt)
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        getAPersentNoListHandler = function(data) {
            console.log(typeof data)
            console.log(data)
            $scope.list = data.data;
            if(data.data.length == 0){
                $scope.state.dataNone = true;
            }else{
                $scope.state.dataNone = false;
            }

            comparePagin(paginData, data); // �����ҳ����
            $scope.state.showPagin = (data.lastPage > 1);
            $scope.state.hasMoreData = (data.currentPage < data.lastPage);
        };

    getAPersentNoList(ajaxParams, getAPersentNoListHandler);

    // -- ���Ӧ��
    var getApplication = function(opt, cb, cberr) {
            ApplicationService.getApplication(opt)
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        addApplicationHandler = function(data) {
            if(data && data['__state'] && data['__state'].code === 10200) {
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
            getApplicationList(ajaxParams, getApplicationListHandler);
        },
        doExport: function () {
            window.location.href="/admin/project/project-list-export?project_id="+ajaxParams.projectId+"&&project_name="+ajaxParams.projectName+"&&city="+ajaxParams.city+"&&district="+ajaxParams.district+"&&is_recommend="+ajaxParams.isRecommend+"&&is_collaborate="+ajaxParams.isCollaborate
            //doExport(ajaxParams,doExportHandler)
        },
        goPrePage:function() { // ��һҳ
            if(paginData.currentPage > 1) {
                $scope.search.page = parseInt(paginData.currentPage, 10) - 1;
                ajaxParams.page = $scope.search.page;
                getApplicationList(ajaxParams, getApplicationListHandler);
            }
        },
        goNextPage:function() { // ��һҳ
            if(paginData.currentPage < paginData.lastPage) {
                $scope.search.page = parseInt(paginData.currentPage, 10) + 1;
                ajaxParams.page = $scope.search.page;
                getApplicationList(ajaxParams, getApplicationListHandler);
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
            getApplicationList(ajaxParams, getApplicationListHandler);
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
    };
});