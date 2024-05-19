install:
		npm ci

lint:
		npx eslint .

dev:
		npx webpack serve --mode development

build:
		NODE_ENV=production npx webpack