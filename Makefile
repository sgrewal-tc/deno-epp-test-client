OTE_SERVERS=epp.ote.tucowsregistry.net epp.ote.registry.love epp.ote.registry.hiphop epp.ote.registry.coop epp.ote.registry.cloud epp.ote.mynicregistry.my epp.ote.registry.bar epp.ote.odregistry.com epp.ote.registry.click epp.ote.registryservices.music epp.ote.nic.yandex epp.ote.kyregistry.ky epp.ote.dmdomains.dm epp.ote.reg.iq epp.ote.kwregistry.kw epp.ote.nixiregistry.in epp.ote.mobile-registry.com
TLDS=click love hiphop coop cloud my bar locker forum music yandex ky dm iq kw in dish

test-check-fee-ote:
	bash -c 'ote_servers=($(OTE_SERVERS)); INDEX=0; tlds=($(TLDS)); \
	for i in "$${ote_servers[@]}"; do \
	    echo "EPP Server: $$i"; \
		deno run --allow-run --allow-net=$$i \
		--allow-read=certs --cert certs/ote-ca-bundle.crt main.ts \
		--host $$i --domain sgrewal.$${tlds[$$INDEX]}; \
		let INDEX=$$INDEX+1; \
	done' | grep -E 'EPP Server|result code|Duration' >> ote_test_$$(date +%s).log