package com.amdocs.digital.ms.party.organizationvalidator.gateways.delegates;

import static org.mockito.Mockito.when;

import javax.inject.Inject;

import org.junit.Ignore;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.mock.mockito.MockBean;

import com.amdocs.digital.ms.party.organization.asyncmessages.models.ValidateManageOrganizationRelationship;
import com.amdocs.digital.ms.party.organization.asyncmessages.models.ValidateManageOrganizationRelationshipCreateEvent;
import com.amdocs.digital.ms.party.organization.asyncmessages.models.ValidateManageOrganizationRelationshipCreateEventPayload;
import com.amdocs.digital.ms.party.organization.ck.resources.interfaces.PartyOrganizationServiceApi;
import com.amdocs.digital.ms.party.organization.ck.resources.models.Organization;
import com.amdocs.digital.ms.party.organizationvalidator.business.constants.PartyOrganizationValidateConstants;
import com.amdocs.digital.ms.party.organizationvalidator.business.repository.interfaces.IOrganizationValidationRepository;
import com.amdocs.digital.ms.party.organizationvalidator.couchbase.dto.ValidateManageOrganizationRelationshipDTO;
import com.amdocs.digital.ms.party.organizationvalidator.tests.setup.ExtendedTestSetUp;
import com.amdocs.digital.ms.party.organizationvalidator.tests.setup.PartyOrganizationValidatorTestHelper;

public class ManageOrganizationRelationshipValidatorResourceMessageDelegateTest extends ExtendedTestSetUp {

	@Inject
	private ManageOrganizationRelationshipValidatorResourceMessageDelegate manageOrganizationRelationshipValidatorResourceMessageDelegate;

	@MockBean
    private IOrganizationValidationRepository repository;
	
    @MockBean
    private PartyOrganizationServiceApi partyOrganizationServiceApi;
	
	@Test
	public void test_excute_move() {
		
		ValidateManageOrganizationRelationshipDTO validateManageOrg = PartyOrganizationValidatorTestHelper
				.getObjectFromJson("UT/payloads/validateManageOrganizationRelationshipFromDB.json", ValidateManageOrganizationRelationshipDTO.class);
		Organization org = PartyOrganizationValidatorTestHelper
				.getObjectFromJson("UT/payloads/partyOrganization.json", Organization.class);
	when(repository.getValidateManageOrganizationRelationship(Mockito.any())).thenReturn(validateManageOrg);
	
	when(partyOrganizationServiceApi.getOrganization(Mockito.any(), Mockito.any(),
			Mockito.any(), Mockito.any(),Mockito.any(), Mockito.any())).thenReturn(org);
	ValidateManageOrganizationRelationshipCreateEvent event = new ValidateManageOrganizationRelationshipCreateEvent();
	
	
	ValidateManageOrganizationRelationshipCreateEventPayload payload = new ValidateManageOrganizationRelationshipCreateEventPayload();
	ValidateManageOrganizationRelationship relation = new ValidateManageOrganizationRelationship();
	relation.setAction(PartyOrganizationValidateConstants.MOVE);
	payload.setValidateManageOrganizationRelationship(relation);
	event.setEvent(payload);
	manageOrganizationRelationshipValidatorResourceMessageDelegate.execute(event);
	
	}
	
	@Test
	public void test_excute_merge() {
		
		ValidateManageOrganizationRelationshipDTO org = PartyOrganizationValidatorTestHelper
				.getObjectFromJson("UT/payloads/validateManageOrganizationRelationshipFromDB.json", ValidateManageOrganizationRelationshipDTO.class);
		
	when(repository.getValidateManageOrganizationRelationship(Mockito.any())).thenReturn(org);
	ValidateManageOrganizationRelationshipCreateEvent event = new ValidateManageOrganizationRelationshipCreateEvent();
	
	ValidateManageOrganizationRelationshipCreateEventPayload payload = new ValidateManageOrganizationRelationshipCreateEventPayload();
	ValidateManageOrganizationRelationship relation = new ValidateManageOrganizationRelationship();
	relation.setAction(PartyOrganizationValidateConstants.MERGE);
	payload.setValidateManageOrganizationRelationship(relation);
	event.setEvent(payload);

	manageOrganizationRelationshipValidatorResourceMessageDelegate.execute(event);
	
	
	}
	@Test
	public void test_excute_other() {
		
		ValidateManageOrganizationRelationshipDTO org = PartyOrganizationValidatorTestHelper
				.getObjectFromJson("UT/payloads/validateManageOrganizationRelationshipFromDB.json", ValidateManageOrganizationRelationshipDTO.class);
		
	when(repository.getValidateManageOrganizationRelationship(Mockito.any())).thenReturn(org);
	ValidateManageOrganizationRelationshipCreateEvent event = new ValidateManageOrganizationRelationshipCreateEvent();
	
	ValidateManageOrganizationRelationshipCreateEventPayload payload = new ValidateManageOrganizationRelationshipCreateEventPayload();
	ValidateManageOrganizationRelationship relation = new ValidateManageOrganizationRelationship();
	relation.setAction(PartyOrganizationValidateConstants.DETACH);
	payload.setValidateManageOrganizationRelationship(relation);
	event.setEvent(payload);

	manageOrganizationRelationshipValidatorResourceMessageDelegate.execute(event);
	
	
	}
}
