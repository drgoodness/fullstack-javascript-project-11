install:
		npm ci

lint:
		npx eslint .

dev:
		npx webpack serve --mode development