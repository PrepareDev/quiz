if [[ $VERCEL_ENV = "production" ]]
then
  npm run db:push
fi
