/*!

 *

 */

;(function($) {





var colNums=[];

    var setupLocalVars =

            'var sorTableFilter = getSorTableFilter($(this));'+

            'var pageLength = $(sorTableFilter).data( "pageLength" );'+

            'var RowsAndColsArr = $(sorTableFilter).data( "RowsAndColsArr" );'+

            'var pageStart=$(sorTableFilter).data( "pageStart" );';



    function isColInColNums(colNum, _colNums){

        for ( i in _colNums ){



            if ( _colNums[i].colNum == colNum ){

                return i

            }

        }

        return -1

    };



    function SortIt(TheArr,_colNums) {



        TheArr.sort(Sortmulti);



        function Sortmulti(a,b) {

            swap=0;

            i = 0 ;

            for ( ; i<_colNums.length;i++ ) {

                colNum=_colNums[i].colNum

                if(isNaN(a[ colNum ]-b[ colNum ])){

                    if((isNaN(a[ colNum ]))&&(isNaN(b[ colNum ])))

                    {swap=(b[ colNum ]<a[ colNum ])-(a[ colNum ]<b[ colNum ]);}

                    else

                    {swap=(isNaN(a[ colNum ])?1:-1);}

                }

                else{swap=(a[ colNum ]-b[ colNum ]);}





                if((i+1==_colNums.length)||(swap!=0))

                {return swap*_colNums[i].asc;}



            }

            //alert("oops")

            return swap;



        }

    };



    function getSorTableFilter(obj) {

        return $(obj).parents(".sorTableFilterNav:first").next()

    };



    function setTableRows(obj) {

        var sorTableFilter = getSorTableFilter($(obj))

        

        // apply filters

        var sorTableFilterNav = $(sorTableFilter).prev()

        var pageStart = $(sorTableFilter).data( "pageStart" )

        var pageLength = $(sorTableFilter).data( "pageLength" )



        var p_Arr = $(sorTableFilter).data( "RowsAndColsArr" )

        if (p_Arr==null)

            return

        if (p_Arr[0]==null)

            return

        var numCols = p_Arr[0].length



        var filterArr = new Array()



        var filterOn=false



        for (i=0;i<numCols;i++) {

            filterArr[i]=$(sorTableFilter).find("thead th:eq("+i+") input").val()

            if ($.trim(filterArr[i])!='')

                filterOn=true

        }

        var newArr = []

        if ( filterOn==true ) {



            for ( i=0; i<(p_Arr.length) ; i++ ) {

                var match = true

                for ( var j in p_Arr[i] ) {

                    if ( filterArr[j] ) {

                        if ( (''+p_Arr[i][j]).indexOf(''+filterArr[j]) == -1 ){

                            match=false

                            break

                        }

                    }



                }

                if ( match==true )

                    newArr.push(p_Arr[i])

            }

        } else {

            //alert("no filter filter")

            newArr=p_Arr

        }



        var options=""

        var numPages = parseInt(newArr.length/pageLength)



        if ( (numPages*pageLength)<newArr.length) {

            numPages=numPages+1;

        }

        for ( var x=1;x<=numPages;x++ ) {

            options+="<option value=" +x + ">" + x + " / " + numPages + "</option>"

        }

        $(sorTableFilterNav).find(".pageNum").html(options);

        $(sorTableFilterNav).find(".pageNum").val(pageStart)

        $(sorTableFilterNav).find(".pageLength").val(pageLength)

        $(sorTableFilterNav).find(".pageLength").attr("size",(""+pageLength).length)

        $(sorTableFilterNav).find(".totals").html("Displaying "+newArr.length + " of " + p_Arr.length )



        var i=((pageStart-1)*pageLength)

        var ret="";

        var autocompleteCols = []

        for ( j=0; j<numCols; j++ ) {

            autocompleteCols[j]=[]

        }

        tmp="<tr>"+$(sorTableFilter).find('tbody tr:first').html()+"</tr>"

        classes=[]

        for (j=0;j<numCols;j++) {

            classes[j]=$(tmp).find("td:eq("+j+")").attr("class")

        }

        for ( ; i<(pageStart*pageLength) && i < newArr.length; i++ ) {

            //if ( !newArr[i] ) continue

            ret+="<tr>"

            for (j=0;j<numCols;j++) {

                //console.log(newArr[i]+","+i+","+j)

                ret+="<td class='"+classes[j]+"'>"+(newArr[i][j])+"</td>"

            }

            ret+="</tr>"

        }



        for ( i=0 ; i < newArr.length; i++ ) {

            for (j=0;j<numCols;j++) {

                autocompleteCols[j][''+newArr[i][j]]=newArr[i][j]

            }

        }

        x=0

        //alert(autocompleteCols[x])

        $(sorTableFilter).find('thead th input').each( function () {

            //alert($(this).autocomplete)

            arr=[]

            hh=autocompleteCols[x]

            str=""

            for ( ii in autocompleteCols[x] ){

                if ( typeof autocompleteCols[x][ii] != "function" )

                    arr.push($.trim(autocompleteCols[x][ii]))

            }

            //arr.pop() /// pop last one of associative aray - contains the word 'unique' for some reason'

            //alert(str)

            //$(this).unautocomplete()

            $(this).autocomplete(  arr,{

                cacheLength:50,

                selectFirst: false,

                matchContains: true,

                minChars:0,

                autoFill: false,

                max:20,

                scrollHeight:360,

                formatItem: function(data) {

                    return (''+data).replace(/<.*?>/ig, "" );

                }

            })

            x++

        })



        $(sorTableFilter).find('tbody').html("")

        $(sorTableFilter).find('tbody').html(ret)

        $(sorTableFilter).show()

        //$(sorTableFilter).find("tbody tr:even td").css("background-color","white")

    };



    function bindHandlers () {



        $(".pagePlus").click(function() {

            eval(setupLocalVars)

            var lastPage=$(sorTableFilter).prev().find("option:last").val()

            if ( pageStart < lastPage ) {

                $(sorTableFilter).data( "pageStart", pageStart+1)

                setTableRows($(this))

            }

        })

        $(".pageMinus").click(function(){

            eval(setupLocalVars)

            if ( pageStart>1){

                $(sorTableFilter).data( "pageStart", pageStart-1)

                setTableRows($(this))

            }

        })

        $(".pageFirst").click(function(){

            eval(setupLocalVars)

            $(sorTableFilter).data( "pageStart", 1)

            setTableRows($(this))

        })

        $(".pageLast").click(function(){

            eval(setupLocalVars)

            var lastPage=$(sorTableFilter).prev().find("option:last").val()

            $(sorTableFilter).data( "pageStart", lastPage)

            setTableRows($(this))

        })

        $(".pageNum").change(function(){

            eval(setupLocalVars)

            $(sorTableFilter).data( "pageStart", $(this).val() )

            setTableRows($(this))

        })

        $(".pageLength").blur(function(){

            eval(setupLocalVars)

            var pageLength = $(sorTableFilter).data( "pageLength" )

            if ( pageLength != parseInt($(this).val()) ) {

                $(sorTableFilter).data( "pageLength", parseInt($(this).val()) )

                $(sorTableFilter).data( "pageStart", 1 )

                setTableRows($(this))

            }

        })

        $(".reset").click(function(){



            colNums=[]

            $(".filterInput").val("")

            $(".sortIndicator").html("")

            $(".filterInput:first").blur()

        })



        $(".filterInput").keyup(function(ev){

            if ( $(this).val()!=$(this).data("oldVal") ) {

                $(this).data("oldVal",$(this).val())

                setTableRows($(this).parents("table:first").prev().find(".pageNum"))

            }

        })



        $(".filterInput").blur(function(ev){

            if ( $(this).val()!=$(this).data("oldVal") ) {

                $(this).data("oldVal",$(this).val())

                setTableRows($(this).parents("table:first").prev().find(".pageNum"))

            }

        })



        $(".sortHeader").hover(

            function(){

                cursor=$(this).css("cursor")

                $(this).css("cursor","pointer")

            },

            function(){

                $(this).css("cursor",cursor)

            }

        )



        $(".sortHeader").click(function(){



            var colClicked = $(this).parents("tr:first").children().index($(this).parents("th:first"))

            //colClicked++;

            var index=isColInColNums ( colClicked, colNums )



            if ( index!=-1 ) {

                if( colNums[index].asc==-1 ) {

                    colNums.splice(index,1)

                } else {

                    colNums[index].asc=-1

                }

            } else {

                //alert("append")

                colNums.push({colNum:colClicked,asc:1})

            }



            var sorTableFilter = $(this).parents("table:first")



            $(this).parents("tr:first").find(".sortIndicator").html("")



            for ( i in colNums ) {

                $(this).parents("tr:first").find("th:eq("+colNums[i].colNum+") .sortIndicator").html(' ('+colNums[i].asc*(parseInt(i)+1)+')')

            }



            SortIt($(sorTableFilter).data('RowsAndColsArr'), colNums)

            $(sorTableFilter).data("pageStart",1);

            setTableRows($(sorTableFilter).prev().find(".pageNum"))

        })



    };



    jQuery.fn.sorTableFilter = function ( options ) {



        var sorTableFilterNav=

            '<span class="sorTableFilterNav">' +

                '<button class="pageNav pageFirst" >&lt;&lt;</button>' +

                '<button class="pageNav pageMinus" >&lt;</button>' +

                '<select class="pageNum"></select>' +

                '<button class="pageNav pagePlus">&gt;</button>' +

                '<button class="pageNav pageLast">&gt;&gt;</button>' +

                '<input type="text" class="pageLength" />' +

                '<button style="" class="reset">Reset</button>' +

                ' <span class=totals></span>' +

            '</span>';



        var options = jQuery.extend ( // default settings

            {

                pageLength : 200,

                pageStart : 0,

                tbody:null

            },

            options

        );



        this.each ( function() {

            jQuery(this).data("pageStart", options.pageStart)

            jQuery(this).data("pageLength", options.pageLength)

            jQuery(sorTableFilterNav).insertBefore( jQuery(this) );



            jQuery(this).find("thead th").each ( function () {

                jQuery(this).html( "<span class=sortHeader>"+jQuery(this).html()+"</span>" );

            })



            var RowsAndColsArr = new Array();



            if ( options.tbody==null ) {

                jQuery(this).find("tbody tr").each ( function () {

                    var RowsAndColsArrCols = new Array();

                    jQuery(this).find("td").each( function () {

                        RowsAndColsArrCols.push( jQuery(this).html() );

                    });

                    RowsAndColsArr.push(RowsAndColsArrCols);

                });

                jQuery(this).data( "RowsAndColsArr", RowsAndColsArr)

            } else {

                jQuery(this).data( "RowsAndColsArr", options.tbody)

            }



            jQuery(this).find("thead th").append(

                "<span class=sortIndicator xstyle='xfloat:right'></span>\n"+

                "<br/><input size=10 class=filterInput style='float:left' type=text />"

                )

        }) ;

        bindHandlers ()

        jQuery(this).prev().find(".pageFirst").click();



        return ( this ) ;

    };

})(jQuery) ;
