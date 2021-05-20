main: run

run: build
	docker run \
		--rm \
		-p 10000:5000/tcp \
		"z-ro-app:latest"

build:
	docker build -t "z-ro-app:latest" .

rebuild:
	docker build --no-cache -t "z-ro-app:latest" .

save: build
	docker save "z-ro-app:latest" -o "z-ro-app.tar"

lint:
	docker pull "github/super-linter:latest"
	docker run \
		-e RUN_LOCAL=true \
		-v "$(shell pwd):/tmp/lint" \
		"github/super-linter"

lint_one:
ifdef file
	docker pull github/super-linter:latest
	docker run \
		-e RUN_LOCAL=true \
		-v $(shell pwd)/$(file):/tmp/lint/$(file) \
		github/super-linter
else
	@echo No file provided
endif

fix:
	npx standard --fix

.PHONY: main run build rebuild save web lint line_one fix
