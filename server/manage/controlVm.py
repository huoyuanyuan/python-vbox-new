import subprocess

# name:控制虚拟机名字  contInfo:操作字段 (pause,resume,reset,poweroff)
def controlVm(name,contInfo):
	cmd = 'VBoxManage controlvm ' + name + ' ' + contInfo;
	if len(name) == 0:
		return '需要uuid或者name'
	elif len(contInfo) == 0:
		return '需要操作字段'
	else:
		p = subprocess.Popen(cmd,shell=True,stdout=subprocess.PIPE)
		while p.poll() is None:
			line = p.stdout.readline()
			line = line.strip()
			if line:
				print('Subprogram output:[{}]'.format(line.decode('gbk')))
		if p.returncode == 0:
			print("Subprogram success")
		else:
			print("Subprogram failed")
		return p.returncode