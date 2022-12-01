```
$ sudo su 
$ cat << EOF > /etc/apt/sources.list.d/google-chrome.list
deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main
EOF
$ wget -O- https://dl.google.com/linux/linux_signing_key.pub |gpg --dearmor > /etc/apt/trusted.gpg.d/google.gpg

$ apt update
Get:1 http://dl.google.com/linux/chrome/deb stable InRelease [1,811 B]
Get:2 http://deb.debian.org/debian bullseye InRelease [116 kB]                                 
Get:3 http://deb.debian.org/debian-security bullseye-security InRelease [48.4 kB]
Get:4 http://deb.debian.org/debian bullseye-updates InRelease [44.1 kB]
Get:5 http://dl.google.com/linux/chrome/deb stable/main amd64 Packages [1,078 B]
Get:6 http://deb.debian.org/debian bullseye/main amd64 Packages [8,184 kB]
Get:7 http://deb.debian.org/debian-security bullseye-security/main amd64 Packages [208 kB]
Get:8 http://deb.debian.org/debian bullseye-updates/main amd64 Packages [14.6 kB]
Fetched 8,618 kB in 2s (4,612 kB/s)
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
All packages are up to date.

root ➜ /workspaces/webpage-screenshot-action (develop) $ apt search google-chrome
Sorting... Done
Full Text Search... Done
google-chrome-beta/stable 108.0.5359.71-1 amd64
  The web browser from Google

google-chrome-stable/stable 108.0.5359.71-1 amd64
  The web browser from Google

google-chrome-unstable/stable 109.0.5414.25-1 amd64
  The web browser from Google



apt install google-chrome-stable

@karol-brejna-i ➜ /workspaces/webpage-screenshot-action (develop) $ ls -la /usr/bin  | grep chrom
lrwxrwxrwx 1 root root         31 Dec  1 11:03 google-chrome -> /etc/alternatives/google-chrome
lrwxrwxrwx 1 root root         32 Nov 29 00:49 google-chrome-stable -> /opt/google/chrome/google-chrome

@karol-brejna-i ➜ /workspaces/webpage-screenshot-action (develop ✗) $ ls -la /usr/bin/goo*
lrwxrwxrwx 1 root root 31 Dec  1 11:03 /usr/bin/google-chrome -> /etc/alternatives/google-chrome
lrwxrwxrwx 1 root root 32 Nov 29 00:49 /usr/bin/google-chrome-stable -> /opt/google/chrome/google-chrome

```