function generateTransactionID(): string {
    return `TRID-${Date.now()}`;
}

export function epp_login(): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <login>
      <clID>clid_a</clID>
      <pw>password_a</pw>
      <options>
        <version>1.0</version>
        <lang>en</lang>
      </options>
      <svcs>
        <objURI>urn:ietf:params:xml:ns:domain-1.0</objURI>
        <objURI>urn:ietf:params:xml:ns:host-1.0</objURI>
        <objURI>urn:ietf:params:xml:ns:contact-1.0</objURI>
        <svcExtension>
          <extURI>urn:ietf:params:xml:ns:secDNS-1.1</extURI>
          <extURI>urn:ietf:params:xml:ns:rgp-1.0</extURI>
          <extURI>urn:ietf:params:xml:ns:idn-1.0</extURI>
          <extURI>urn:ietf:params:xml:ns:launch-1.0</extURI>
          <extURI>urn:ietf:params:xml:ns:fee-0.7</extURI>
        </svcExtension>
      </svcs>
    </login>
    <clTRID>SG${generateTransactionID()}</clTRID>
  </command>
</epp>`;
  }
  
  export function epp_logout(): string {
      return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
  <epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
    <command>
      <logout/>
      <clTRID>SG${generateTransactionID()}</clTRID>
    </command>
  </epp>`;
  }
  
  export function domain_check_fee(domain:string): string {
      return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
    <command>
        <check>
            <domain:check xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
                <domain:name>${domain}</domain:name>
            </domain:check>
        </check>
        <extension>
            <fee:check xmlns:fee="urn:ietf:params:xml:ns:fee-0.7">
                <fee:domain>
                    <fee:name>${domain}</fee:name>
                    <fee:currency>USD</fee:currency>
                    <fee:command>create</fee:command>
                    <fee:period unit="y">1</fee:period>
                </fee:domain>
                <fee:domain>
                    <fee:name>${domain}</fee:name>
                    <fee:currency>USD</fee:currency>
                    <fee:command>renew</fee:command>
                    <fee:period unit="y">1</fee:period>
                </fee:domain>
                <fee:domain>
                    <fee:name>${domain}</fee:name>
                    <fee:currency>USD</fee:currency>
                    <fee:command>transfer</fee:command>
                    <fee:period unit="y">1</fee:period>
                </fee:domain>
                <fee:domain>
                    <fee:name>${domain}</fee:name>
                    <fee:currency>USD</fee:currency>
                    <fee:command>restore</fee:command>
                    <fee:period unit="y">1</fee:period>
                </fee:domain>
            </fee:check>
        </extension>
        <clTRID>SG${generateTransactionID()}</clTRID>
    </command>
</epp>`;
  }
  