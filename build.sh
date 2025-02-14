#-- Prepare control file
echo "-- Create control file"
cp control_template dist/control

#-- Set version date in control file (replaces __version__ with current date
date=$(date +'%Y%m%d')
sed -i "s/__version__/$date/g" dist/control

#-- Copy frontend and backend to dist store
echo "-- Copy frontend to store/data/lm-logs folder"
cp frontend/dist/* dist/store/data/lm-logs/ -r

echo "-- Copy backend to store/data/lm-logs folder"
mkdir dist/store/data/lm-logs/api -p
cp backend/* dist/store/data/lm-logs/api/ -r

#-- Go to dist or stop
cd dist || exit

#-- Compress data files
echo "-- Compress data files"
tar -czvf data.tar.gz store

#-- Calculate file size and change size placeholder with size of data tarball
echo "-- Setting file size for data tarball"
fileSize=$(du -b data.tar.gz | cut -f1)
sed -i "s/__size__/$fileSize/g" control

#-- Compress control file
tar -czvf control.tar.gz control

cd ../

echo "-- Move control and data files"
mv dist/control.tar.gz ./
mv dist/data.tar.gz ./

echo "-- Compress app"
tar -czvf lm-logs.ipk control.tar.gz data.tar.gz

echo "-- Remove compressed app files"
rm control.tar.gz data.tar.gz

echo "-- Remove dynamic data"
rm dist/store/data/lm-logs/* -r

echo "-- Finished without a hitch :)"
