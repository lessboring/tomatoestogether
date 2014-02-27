@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\node_modules\coffee-script\bin\coffee" %*
) ELSE (
  node  "%~dp0\node_modules\coffee-script\bin\coffee" %*
)