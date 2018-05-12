import subprocess

def delVm(uuid=''):
	cmd = 'VBoxManage unregistervm ' + uuid +' -delete';
	if len(uuid) == 0:
		return '需要uuid或者name'
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