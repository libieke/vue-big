 //导出ecxel
 downLoadKPIExcel() {
  //第一步，引入库，使用import引入可能会导致引入的不全
        const XLSX = require("xlsx");
        const XLSXStyle = require("xlsx-style");
        const FileSaver = require("file-saver");
   
  //这是后端返回的数据进行处理，只挑出要导出的数据
        const newArr = [];
        this.tableData.map((item, index) => {
          var obj = {};
          obj.index = index + 1;
          obj.name = item.name;
          obj.deptName = item.deptName;
          obj.valueScore = item.valueScore;
          obj.valueRealScore = item.valueRealScore;
          obj.targetScore = item.targetScore;
          obj.KPIScore = (Number(item.targetScore) + Number(item.valueRealScore)).toFixed(2);
          obj.bonusCoefficient = item.bonusCoefficient + "%";
          newArr.push(obj);
        });
  //处理结束，如果是直接用table的数据请看后面的代码
   
        // 创建工作簿
        const workbook = XLSX.utils.book_new();
   
        // 创建工作表并定义列标题
        const worksheet = XLSX.utils.aoa_to_sheet([
          [`${this.year}年${this.month}月奖金系数汇总`],  //这里是要合并单元格的，所以写一个数据就行
          ["序号", "名字", "部门", "价值观分数", "价值观得分", "****实际得分", "****得分", "系数"], //第二列表头，共8列，这个数字在下面的代码会用到
        ]);
   
        //合并单元格 这里指定列合并单元格的范围,与列宽度设置类似也是一个数组
        let excelMerges = [];
        excelMerges.push({
          s: { r: 0, c: 0 },
          e: { r: 0, c: 7 }, //合并范围是第1行第一列到第1行第8列
        });
        worksheet["!merges"] = excelMerges; //可以打印worksheet数据来看，以！开头的就是设置列宽行高合并的，其他就是单元格
   
        // 遍历后端数据并写入工作表
        newArr.forEach((row, rowIndex) => {
   
          const sheetRow = [];
    //循环列
          for (let i = 0; i < 8; i++) {
  //下面是因为中间的数据格式必须要是数字，所以push进去要转一下，默认都是字符串类型的，不需要的可以删除
            if (i === 3 || i === 4 || i === 5 || i === 6) {
              sheetRow.push(Number(Object.values(row)[i]));
            } else {
              sheetRow.push(Object.values(row)[i]); // 替换为实际属性名或处理空值
            }
          }
       //将数据添加到工作表中，从第三行开始add，因为一二行是表头
          XLSX.utils.sheet_add_aoa(worksheet, [sheetRow], { origin: rowIndex + 2 });
        });
   
  //开始添加样式
        const styles = {
  //第一行表头的样式
          firstHeader: {
            font: { bold: true, name: "微软雅黑", sz: 16 },
            alignment: {
              //文字居中
              horizontal: "center",
              vertical: "center",
              wrap_text: true,
            },
            border: {
              top: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
              bottom: { style: "thin" },
            },
          },
  //第二行表头的样式
          headerStyle: {
            font: { bold: true, name: "微软雅黑", sz: 11 },
            fill: { fgColor: { rgb: "C0C0C0" } }, // 背景色
            alignment: {
              //文字居中
              horizontal: "center",
              vertical: "center",
              wrap_text: true,
            },
            border: {
              top: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
              bottom: { style: "thin" },
            },
            // height: 40,
          },
  //其他单元格的样式
          cellStyle: {
            font: { name: "微软雅黑", sz: 11 },
            alignment: {
              //文字居中
              horizontal: "center",
              vertical: "center",
              wrap_text: true,
            },
            border: {
              top: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
              bottom: { style: "thin" },
            },
            // height: 40,
          },
        };
   
        // 设置列宽行高
    
  //先声明worksheet["!rows"]、worksheet["!cols"]
        if (!worksheet["!rows"] || !worksheet["!cols"]) {
          worksheet["!rows"] = [];
          worksheet["!cols"] = [];
        }
  //worksheet["!ref"]是工作表的范围
        const range = XLSX.utils.decode_range(worksheet["!ref"]);
       
  //循环列，设置列宽为20字符，也可以设置像素wpx：200
        for (var i = 0; i < 8; i++) {
          worksheet["!cols"][i] = { wch: 20 };
        }
  //循环行，设置第一行像素为40，其余行为30
        for (let i = range.s.r + 1; i < range.e.r + 1; i++) {
          worksheet["!rows"][0] = { hpx: 40 };
          worksheet["!rows"][i] = { hpx: 30 };
        }
        console.log(worksheet);
   
        // 应用样式到列头
        for (let col of ["A", "B", "C", "D", "E", "F", "G", "H"]) {
          let cellRef1 = `${col}1`;
          if (worksheet[cellRef1]) {
            worksheet[cellRef1].s = styles.firstHeader;
          }
          let cellRef2 = `${col}2`;
          if (worksheet[cellRef2]) {
            worksheet[cellRef2].s = styles.headerStyle;
          }
        }
   
       //应用样式到单元格
        for (let row = 3; row < range.e.r + 1; row++) {
   
          for (let col of ["A", "B", "C", "D", "E", "F", "G", "H"]) {
            let cellRef = `${col}${row}`;
            if (worksheet[cellRef]) {
              worksheet[cellRef].s = styles.cellStyle;
   
            }
          }
        }
   
   
   
        // 添加工作表到工作簿
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        // 确保导出时包含样式信息，一定要使用xlsxstyle来写入，不然就没有样式了
        const wbOut = XLSXStyle.write(workbook, { bookType: "xlsx", type: "binary" });
   
        FileSaver.saveAs(
          // Blob: 对象表示一个不可变 原始数据的类文件对象,不一定是JS原生格式的数据。
          // File: 基于Blob，继承了blob的功能并将其扩展使其支持用户系统上的文件。
          new Blob([this.s2ab(wbOut)], { type: "appliction/octet-stream" }),
          // 设置导出的文件名称可随意
          `2023年12月份*****.xlsx`,
        );
   
      },
      s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      },