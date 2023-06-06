#! /usr/bin/python3

import cgi 
import subprocess

print("context-type: text/html")
print()

#print("hello")

data = cgi.FieldStorage()
u_l = data.getvalue("z")

cmmd = "sudo "+u_l

try:
	output = subprocess.getoutput(cmmd)

	if "command not found" in output:
		print("Error Wrong Command")
		print("Try again with correct command")

	else:
		print("The output is :\n ",output)
except:
	print("Error")
