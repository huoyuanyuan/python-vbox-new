import subprocess
import re
def getVmList(running=False):
	if running:
		vmListStr = subprocess.Popen("VBoxManage list runningvms",shell=True,stdout=subprocess.PIPE)
	else:
		vmListStr = subprocess.Popen("VBoxManage list vms",shell=True,stdout=subprocess.PIPE)
	out,err = vmListStr.communicate()
	out = bytes.decode(out)
	vmList = {}
	if len(out) > 0:
		for line in out.splitlines():
			arr = re.split("{",line);
			name = arr[0][1:-2]
			uuid = arr[1][:-1]
			vmList[name] = uuid
	return vmList