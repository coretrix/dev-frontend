.PHONY : boot serve generate clean dev

dev:
	NODE_ENV=development NUXT_API_BASE_URL="http://localhost:5004/" SHOW_REDIS_SEARCH=true yarn dev

# Not for Target 'static', only for target 'server'
# ref: https://nuxtjs.org/docs/get-started/commands/#target-server-default-value
#build:
#	NODE_ENV=development NUXT_API_BASE_URL="http://localhost:5004/" SHOW_REDIS_SEARCH=true yarn build

clean:
	rm -r ./dist/
generate:
	NODE_ENV=development NUXT_API_BASE_URL="http://localhost:5004/" SHOW_REDIS_SEARCH=true yarn generate

serve:
	NODE_ENV=development NUXT_API_BASE_URL="http://localhost:5004/" SHOW_REDIS_SEARCH=true yarn start

boot: clean generate serve