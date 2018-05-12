from flask import *

# 获取vbox数据的方法
from server.manage.getVmList import getVmList
from server.manage.startVm import startVm
from server.manage.controlVm import controlVm
from server.manage.delVm import delVm
from server.manage.getVmInfo import getVmInfo
from server.manage.createVm import createVm
from server.manage.cloneVm import cloneVm

app = Flask(__name__)

@app.route("/")
def index():
	return render_template("index.html")

# 页面
# vm 全部列表
@app.route("/vmlist")
def get_vmlist():
	noRList = {}
	vmlist = getVmList();
	runningVmList = getVmList(True);
	for key in vmlist:
		if key in runningVmList:
			pass
		else:
			noRList[key] = vmlist[key]
	lenNo = len(noRList)
	lenR = len(runningVmList)
	noRListArr = []
	rListArr = []

	for key in noRList:
		obj = {}
		obj["name"] = key
		obj["uuid"] = noRList[key]
		vmInfo = getVmInfo(key);
		obj["ostype"] = vmInfo['ostype']
		obj['adrs'] = vmInfo['selfAdres']
		noRListArr.append(obj)
	for key in runningVmList:
		obj = {}
		obj["name"] = key
		obj["uuid"] = runningVmList[key]
		vmInfo = getVmInfo(key);
		obj["ostype"] = vmInfo['ostype']
		obj['adrs'] = vmInfo['selfAdres']
		rListArr.append(obj)
	return render_template('vmlist.html',noRListArr=noRListArr,lenNo=lenNo,rListArr=rListArr,lenR=lenR)
# vm 运行列表
@app.route("/runningVmList")
def get_running_vmlist():
	vmlist = getVmList(True);
	lenN = len(vmlist)
	return render_template("vmlist.html",vmlist=vmlist,lenN=lenN,running=True)
# 虚拟机信息页
@app.route("/vminfo")
def get_vminfo():
	name = len(request.args) and request.args['name']
	if len(name) == 0:
		return render_template("infolist.html",err=True)
	else:
		vmInfo = getVmInfo(name)
		return render_template("infolist.html",err=False,vmInfo=vmInfo)
# 创建虚拟机
@app.route("/create_vm")
def create_vm():
	return render_template("create.html")

# ajax
# 启动虚拟机
# 入参 name(string),uuid(string)
@app.route("/ajax_startVm",methods=['get'])
def ajax_startVm():
	# 获取get数据
	name = request.args.get("name")
	uuid = request.args.get("uuid")
	if len(name) == 0 & len(uuid) == 0:
		return jsonify({'status':0,'info':"两个参数至少需要一个"})
	elif len(uuid)>0:
		pStatus = startVm(uuid)
	else:
		pStatus = startVm(name)
	if pStatus == 0:
		return jsonify({'status':1,'info':'执行成功'})
	elif pStatus == 1:
		return jsonify({'status':0,'pStatus':'执行失败'})
# 控制已经启动的虚拟机
# 入参 name(string), uuid(string) contF(string)(操作字段flag)
@app.route("/ajax_controlVm",methods=['get'])
def ajax_controlVm():
	contFdisc = {
		"1":"pause",
		"2":"resume",
		"3":"reset",
		"4":"poweroff"
	}
	# 获取get数据
	name = request.args.get("name")
	uuid = request.args.get("uuid")
	contF = request.args.get("contF")
	if len(contF) == 0:
		return jsonify({'status':0,'info':"需要参数 contF"})
	elif len(name) == 0 & len(uuid) == 0:
		return jsonify({'status':0,'info':"两个参数至少需要一个"})
	else:
		if contF in contFdisc:
			if len(uuid)>0:
				pStatus = controlVm(uuid,contFdisc[contF])
			else:
				pStatus = controlVm(name,contFdisc[contF])
			if pStatus == 0:
				return jsonify({'status':1,'info':'执行成功'})
			elif pStatus == 1:
				return jsonify({'status':0,'pStatus':'执行失败'})
		else:
			return jsonify({'status':0,'info':"contF 参数有问题"})
# 删除虚拟机
@app.route("/ajax_delVm",methods=['get'])
def ajax_delVm():
	# 获取get数据
	name = request.args.get("name")
	uuid = request.args.get("uuid")
	if len(name) == 0 & len(uuid) == 0:
		return jsonify({'status':0,'info':"两个参数至少需要一个"})
	elif len(uuid)>0:
		pStatus = delVm(uuid)
	else:
		pStatus = delVm(name)
	if pStatus == 0:
		return jsonify({'status':1,'info':'执行成功'})
	elif pStatus == 1:
		return jsonify({'status':0,'pStatus':'执行失败'})
# 创建虚拟机
@app.route("/ajax_createVm",methods=['get'])
def ajax_createVm():
	# 获取get数据
	name = request.args.get("name")
	version = request.args.get("version")
	internalSize = request.args.get("internalSize")
	# memorySize = request.args.get("memorySize")
	if len(name) == 0:
		return jsonify({'status':0,'info':"需要参数 name"})
	elif len(version) == 0:
		return jsonify({'status':0,'info':"需要参数 version"})
	elif internalSize == 0:
		internalSize = 512
	# elif memorySize == 0:
	# 	memorySize =64
	else:
		pStatus = createVm(name,version,internalSize)
	if pStatus == 0:
		return jsonify({'status':1,'info':'执行成功'})
	elif pStatus == 1:
		return jsonify({'status':0,'pStatus':'执行失败'})
# 拷贝虚拟机
@app.route("/ajax_cloneVm",methods=['get'])
def ajax_cloneVm():
	# 获取get数据
	name = request.args.get("name")
	version = request.args.get("version")
	adrs = request.args.get("adrs")
	if len(name) == 0:
		return jsonify({'status':0,'info':"需要参数 name"})
	elif len(version) == 0:
		return jsonify({'status':0,'info':"需要参数 version"})
	elif len(adrs) == 0:
		return jsonify({'status':0,'info':"需要参数 adrs"})
	else:
		pStatus = cloneVm(name,version,adrs)
	if pStatus == 0:
		return jsonify({'status':1,'info':'执行成功'})
	elif pStatus == 1:
		return jsonify({'status':0,'pStatus':'执行失败'})

if __name__ == '__main__':
	app.run(host="0.0.0.0",debug=True)