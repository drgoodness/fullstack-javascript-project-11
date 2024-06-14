install:
		npm ci

lint:
		npx eslint .

dev:
		npx webpack serve --client-overlay

build:
		NODE_ENV=production npx webpack