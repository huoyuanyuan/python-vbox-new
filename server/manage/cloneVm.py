import subprocess

# adrs:拷贝目标vdi地址 name:拷贝后虚拟机名字
def cloneVm(name,version,adrs):
	vdiName = 'vms/' + name + '.vdi'
	cmd = 'vBoxManage clonehd "'+adrs+'" "'+vdiName+'"'
	cmd2 = 'vBoxManage createvm -name '+name+' -ostype '+version+' -register'
	cmd3 = 'vBoxManage storagectl '+ name +' --name "IDE Controller" --add ide --bootable on'
	cmd4 = 'vBoxManage storageattach '+name+' --storagectl "IDE Controller" --port 0 --device 0 --type hdd --medium "'+vdiName+'"'
	if len(name) == 0:
		return '需要name'
	elif len(adrs) == 0:
		return '需要拷贝目标地址'
	elif len(version) == 0:
		return '需要version'
	else:
		p = subprocess.Popen(cmd,shell=True,stdout=subprocess.PIPE)
		while p.poll() is None:
			line = p.stdout.readline()
			line = line.strip()
			if line:
				print('Subprogram output:[{}]'.format(line.decode('gbk')))
		if p.returncode == 0:
			print("Subprogram success1")
		else:
			print("Subprogram failed1")

		p2 = subprocess.Popen(cmd2,shell=True,stdout=subprocess.PIPE)
		while p2.poll() is None:
			line = p2.stdout.readline()
			line = line.strip()
			if line:
				print('Subprogram output:[{}]'.format(line.decode('gbk')))
		if p2.returncode == 0:
			print("Subprogram success2")
		else:
			print("Subprogram failed2")

		p3 = subprocess.Popen(cmd3,shell=True,stdout=subprocess.PIPE)
		while p3.poll() is None:
			line = p3.stdout.readline()
			line = line.strip()
			if line:
				print('Subprogram output:[{}]'.format(line.decode('gbk')))
		if p3.returncode == 0:
			print("Subprogram success3")
		else:
			print("Subprogram failed3")

		p4 = subprocess.Popen(cmd4,shell=True,stdout=subprocess.PIPE)
		while p4.poll() is None:
			line = p4.stdout.readline()
			line = line.strip()
			if line:
				print('Subprogram output:[{}]'.format(line.decode('gbk')))
		if p4.returncode == 0:
			print("Subprogram success4")
		else:
			print("Subprogram failed4")
		return p4.returncode